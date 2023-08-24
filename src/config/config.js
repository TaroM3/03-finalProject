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
    app: {
        persistence: process.env.PERSISTENCE
    }
}