import mongoose from "mongoose";

export default class MongoDAO {
    constructor(config) {
        this.mongoose = mongoose.connect(config.mongo.url).catch(err => {
            console.log(err.message)
            process.exit()
        })

        const timestamp = { timestamp: { createAt: 'created_at', updatedAt: 'updated_at' }}
        // const userSchema = mongoose.Schema()
    }
}