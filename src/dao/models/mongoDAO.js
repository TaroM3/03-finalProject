import mongoose from "mongoose";
import UserModel from "./user.model.js";
// import config from "../../config/config.js";

export default class MongoDAO {
    constructor(config) {
        console.log(config.mongo.url)
        this.mongoose = mongoose.connect(config.mongo.url, {dbName: config.mongo.dbName}).catch(err => {
            console.log(err.message)
            process.exit()
        })

        const timestamp = { timestamp: { createAt: 'created_at', updatedAt: 'updated_at' }}
        const userSchema = mongoose.Schema(UserModel.schema, timestamp)

        this.models = {
            [UserModel.model]: mongoose.model(UserModel.model, userSchema)
        }
    }

    get = async(options, entity) => {
        if(!this.models[entity]) throw new Error('Entity not found in models')
        let results = await this.models[entity].find(options)
        return results
    }

    insert = async(document, entity) => {
        if(!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let instance = new this.models[entity](document)
            let result = await instance.save()
            return result
        } catch (err) {
            console.log(err.message)
            return null
        }
    }

}