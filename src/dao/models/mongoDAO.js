import mongoose from "mongoose";
import UserModel from "./user.model.js";
import CartModel from "./cart.model.js";
import ProductModel from "./products.model.js";
import mongoosePaginate from 'mongoose-paginate-v2'
import TicketModel from "./ticket.model.js";
// import config from "../../config/config.js";

export default class MongoDAO {
    constructor(config) {
        // console.log(config.mongo.url)
        this.mongoose = mongoose.connect(config.mongo.url, {dbName: config.mongo.dbName}).catch(err => {
            console.log(err.message)
            process.exit()
        })

        this.mongoose.then(mongoose.set('strictQuery', false))
        const timestamp = { timestamp: { createAt: 'created_at', updatedAt: 'updated_at' }}
        
        
        const userSchema = mongoose.Schema(UserModel.schema, timestamp)
        const cartSchema = mongoose.Schema(CartModel.schema)
        const productSchema = mongoose.Schema(ProductModel.schema)
        const ticketSchema = mongoose.Schema(TicketModel.schema)
        productSchema.plugin(mongoosePaginate)


        this.models = {
            [UserModel.model]: mongoose.model(UserModel.model, userSchema),
            [CartModel.model]: mongoose.model(CartModel.model, cartSchema),
            [ProductModel.model]: mongoose.model(ProductModel.model, productSchema),
            [TicketModel.model]: mongoose.model(TicketModel.model, ticketSchema)
        }

        // this.models[ProductModel.model].plugin(mongoosePaginate)
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

    delete = async(criteria, entity) => {
        if(!this.models[entity]) throw new Error('Entity not found in models')

        try {
            let result = await this.models[entity].deleteOne(criteria)
            // let result = await instance.del
            return result
        } catch (err) {
            console.log(err.message)
        }
    }

    getLeanExec = async(criteria, entity) => {
        if(!this.model[entity]) throw new Error('Entity not fount in models')

        try {
            let results = await this.models[entity].find(criteria).lean().exec()
            return results            
        } catch (err) {
            console.log(err.message)
            return null
        }
    }

    getPaginate = async(criteria, search, options, entity) => {
        if(!this.models[entity]) throw new Error('Entity not found in models')

        try {
            // let instance = await this.models[entity].find()
            // var searching = "durian"
            let results = await this.models[entity].paginate(search, options)
            // productModel.paginate(search, options)
            // console.log(JSON.stringify(results, null, 2, '\t'));
            return results
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    update = async(criteria, data, entity) => {
        if(!this.models[entity]) throw new Error('Entity not found in models')

        try {
            let instance = await this.models[entity].find(criteria)
            console.log(instance)
            let result = await this.models[entity].updateOne(criteria, {...instance, ...data})
            return result
        } catch (err) {
            console.log(err.message)
            return null
        }
    }

}