import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        // @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);

        if (!user) {
            throw new NotFoundException('Username not found');
        }

        // find if user password match
        const match = await this.comparePassword(pass, user['dataValues'].password);
        if (!match) {
            throw new BadRequestException('Invalid password');
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    public async login(user) {
        const token = await this.generateToken(user);

        return { user, token };
    }

    public async create(user) {
         // DEBUGING
        console.log('USER => ', user);

        // hash the password
        const pass = await this.hashPassword(user.password);

        // DEBUGING
        console.log('PASS => ', pass);

        // create the user
        const newUser = await this.userService.create({ 
            name: user.name,
            email: user.email,
            password: pass,
            gender: user.gender,
        });

         // DEBUGING
        console.log('NEW USER => ', newUser);

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const token = await this.generateToken(result);

         // DEBUGING
        console.log('TOKEN => ', token);

        // return the user and the token
        return { user: result, token };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}