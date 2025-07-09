import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LocalStrategy } from './local.strategy';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    // @UseGuards(LocalStrategy)
    @Post('login')
    async login(@Body() body: UserDto) {
        return await this.authService.login(body);
    }

    @Post('signup')
    async signUp(@Body() user: UserDto) {
        // DEBUGGING
        console.log('USER => ', user);

        return await this.authService.create(user);
    }
}