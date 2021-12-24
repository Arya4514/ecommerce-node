module.exports = {
    APP_NAME: 'Petrolpump',
    PORT: 8080,
    DB: {
        username: 'postgres',
        password: 'root',
        database: 'ecommerce',
        host: '127.0.0.1',
        // host: '127.0.0.1',
        dialect: 'postgres'
    },
    ENCRYPTION_KEY: "abcd12345",
    jwt_issuer: "blackwolve",
    jwt_secret: "iloveblackwolve",
    EMAIL_CONFIG: {
        host: "in-v3.mailjet.com",
        port: 465,
        secure: true,
        email: "mailer@networklab.ca",
        username: "7082a9d99232b4b24d608a823abf0150",
        password: "2766fbe0bd82e241876c72ed144ed0db"
    },
    BASE_DIR_PATH: process.cwd(),
    END_POINT: "http://localhost:3000",
    ACCESS_KEY_ID: 'N5NY6PVLZJFEOJK5B6WN',
    SECRET_ACCESS_KEY: 'i3IhnAloVnPcleem4UitEIv4wXs/67J79yizA+OgGsE',
    SPACES_ENDPOINT: 'fra1.digitaloceanspaces.com',
    BUCKET: 'petrolpump',
    BASE_PATH: 'bw_petrolpump'
};
