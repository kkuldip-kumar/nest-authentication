

import { RequestModel } from '@/middleware/auth.middleware';
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestModel>();
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
        }
        const tokenArray: string[] = authHeader.split(' ');
        if (tokenArray.length !== 2) {
            throw new HttpException('Invalid authorization format', HttpStatus.UNAUTHORIZED);
        }

        const token = tokenArray[1];
        try {
            const decodedToken = await this.authService.validateToken(token);

            const user = await this.userService.findOne(decodedToken.sub.id);
            if (!user) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            request.user = user;
            return true;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}