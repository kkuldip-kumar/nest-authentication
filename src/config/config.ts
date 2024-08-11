export const config = () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    secrets: {
        jwtSecret: process.env.JWT_SECRET
    }
})