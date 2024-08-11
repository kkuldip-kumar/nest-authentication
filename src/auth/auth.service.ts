import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailEvent } from '@/events/email.event';
import { ResetToken } from './entities/reset-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { createHash, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(ResetToken)
        private resetTokenRepo: Repository<ResetToken>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepo: Repository<RefreshToken>,
        private jwtService: JwtService,
        private eventEmitter: EventEmitter2,
    ) { }

    generateResetToken(): string {
        const randomToken = randomBytes(32).toString('hex');
        const token = createHash('sha256').update(randomToken).digest('hex');
        return token;
    }

    async generateJwt(user: any): Promise<string> {
        return this.jwtService.signAsync({ user });
    }

    async hashPassword(password: string): Promise<string> {
        const result = await bcrypt.hash(password, 12);
        return result;
    }

    async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
        const result = await bcrypt.compare(password, storedPasswordHash);
        return result;
    }

    async validateToken(token: string) {
        return this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET
        });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepo.findOneBy({ email });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async signup(signupData: SignupDto) {
        const { email, password, name } = signupData;

        //Check if email is in use
        const emailInUse = await this.userRepo.findOneBy({ email });
        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            ...signupData,
            password: hashedPassword
        }
        const res = await this.userRepo.save(newUser);
        if (!res) {
            throw new ForbiddenException();
        }
        const emailData = {
            user: { email: newUser.email, name: newUser.name },
            token: "030479"
        }
        this.eventEmitter.emit(
            'welcome.email',
            new EmailEvent(emailData),
        );
        return res;
    }

    async login(credentials: LoginDto) {
        const { email, password } = credentials;
        //Find if user exists by email
        try {
            const user = await this.userRepo.findOneBy({ email });
            if (!user) {
                throw new UnauthorizedException('Wrong credentials');
            }

            //Compare entered password with existing password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new UnauthorizedException('Wrong credentials');
            }
            //Generate JWT tokens
            const { password: savedPassword, ...rest } = user
            const tokens = this.generateUserTokens(rest);

            return {
                ...tokens,
                userId: user.id,
            };
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }



    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        // Find the user by ID
        try {

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found...');
            }

            // Compare the old password with the password in DB
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                throw new UnauthorizedException('Wrong credentials');
            }

            // Hash the new password
            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = newHashedPassword;

            // Save the updated user
            await this.userRepo.save(user);
        } catch (error) {
            console.error('Error during Change password:', error);
            throw error;
        }
    }

    async forgotPassword(email: string) {
        try {

            const user = await this.userRepo.findOneBy({ email });

            if (user) {
                //If user exists, generate password reset link
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const token = this.generateResetToken()

                // const resetToken = nanoid(64);
                const resetTokenEntity = this.resetTokenRepo.create({
                    token: token,
                    user,
                    expiryDate,
                });

                await this.resetTokenRepo.save(resetTokenEntity);
                //Send the link to the user by email
                const emailData = {
                    user: { email: user.email, name: user.name },
                    token: token
                }
                this.eventEmitter.emit(
                    'reset.password',
                    new EmailEvent(emailData),
                );
            }

            return { message: 'If this user exists, they will receive an email' };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during forgot password',
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }

    }

    async resetPassword(newPassword: string, token: string) {

        try {
            const foundToken = await this.resetTokenRepo.findOne({ where: { token: token }, relations: ['user'], });
            if (!foundToken || new Date() > foundToken.expiryDate) {
                throw new UnauthorizedException('Invalid or expired reset token');
            }

            await this.resetTokenRepo.delete(foundToken.id);


            const user = await this.userRepo.findOneBy({ id: foundToken.user.id });

            if (!user) {
                throw new InternalServerErrorException('User not found');
            }


            user.password = await bcrypt.hash(newPassword, 10);
            await this.userRepo.save(user);

            return { message: 'Password has been successfully reset' };

        } catch (error) {
            console.error('reset password:', error);
            throw error;
        }
    }



    async refreshTokens(refreshToken: string) {
        try {

            const token = await this.refreshTokenRepo.findOne({
                where: { token: refreshToken, expiryDate: MoreThanOrEqual(new Date()) },
                relations: ['user'],
            });

            if (!token) {
                throw new UnauthorizedException('Refresh token is invalid or expired');
            }

            return this.generateUserTokens(token.user);
        } catch (error) {
            console.error('Error refresh token:', error);
            throw error;
        }
    }

    private generateUserTokens(userId: any) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // Save the new refresh token
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // Set expiry to 7 days

        const newRefreshToken = this.refreshTokenRepo.create({
            token: refreshToken,
            user: { id: userId },
            expiryDate,
        });

        this.refreshTokenRepo.save(newRefreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }
}
