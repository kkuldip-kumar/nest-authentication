import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { RequestModel } from '@/middleware/auth.middleware';
import { AuthGuard } from '@/gaurds/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('signup')
    async signUp(@Body() signupData: SignupDto) {
        return this.authService.signup(signupData);
    }

    @Post('login')
    async login(@Body() credentials: LoginDto) {
        console.log('login')
        return this.authService.login(credentials);
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @Post('change-password')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Req() req: RequestModel
    ) {
        return this.authService.changePassword(
            req.user.id,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword,
        );
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password')
    // @UseGuards(JwtAuthGuard)
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        return this.authService.resetPassword(
            resetPasswordDto.newPassword,
            resetPasswordDto.resetToken,
        );
    }

}
