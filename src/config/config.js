import dotenv from 'dotenv'

dotenv.config()

export default {
    mongo: {
        url: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME
    },
    admin: {
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD
    },
<<<<<<< HEAD
    app: {
        persistence: process.env.PERSISTENCE
=======
    environment: {
        production: process.env.PRODUCTION,
        development: process.env.DEVELOPMENT
>>>>>>> b18bd56f0faecfff8a0ffe7f7ddf4ea02447a652
    }
}