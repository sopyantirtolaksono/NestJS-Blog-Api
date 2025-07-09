import { Injectable, Inject } from '@nestjs/common';
import { User } from './model/user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto | any): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    async findOneByEmail(email: string): Promise<User | any> {
        return await this.userRepository.findOne<User>({ where: { email} });
    }

    async findOneById(id: number): Promise<User | any> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }
}