module.exports = {
    APP_NAME: 'Petrolpump',
    PORT: 8080,
    DB: {
        username: 'postgres',
        password: 'Aryan@1432',
        database: 'ecommerce',
        host: '18.222.40.45',
        dialect: 'postgres'
    },
    ENCRYPTION_KEY: "abcd12345",
    jwt_issuer: "blackwolve",
    jwt_secret: "iloveblackwolve",
    // storage_folder: "/uploads",
    EMAIL_CONFIG: {
        host: "in-v3.mailjet.com",
        port: 465,
        secure: true,
        email: "mailer@networklab.ca",
        username: "7082a9d99232b4b24d608a823abf0150",
        password: "2766fbe0bd82e241876c72ed144ed0db"
    },
    BASE_DIR_PATH: process.cwd() + "/var/www/aerostar",
    END_POINT: "https://aerostarinfra.tk/",
    ACCESS_KEY_ID: 'N5NY6PVLZJFEOJK5B6WN',
    SECRET_ACCESS_KEY: 'i3IhnAloVnPcleem4UitEIv4wXs/67J79yizA+OgGsE',
    SPACES_ENDPOINT: 'fra1.digitaloceanspaces.com',
    BUCKET: 'petrolpump',
    BASE_PATH: 'bw_petrolpump'
};
