import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 4000,
    jwtSecret: process.env.JWT_SECRET
}));