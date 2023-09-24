import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

// const productCollection = "products"

// const productSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     price: Number,
//     status: Boolean,
//     stock: Number,
//     category: String,
//     thumbnails: Array,
// })

// mongoose.set("strictQuery", false)
// productSchema.plugin(mongoosePaginate)
// const productModel = mongoose.model(productCollection, productSchema)

// export default productModel

export default class ProductModel {
    static get model() {
        return "products"
    }

    static get schema() {
        return {
            title: String,
            description: String,
            price: Number,
            status: Boolean,
            stock: Number,
            category: String,
            thumbnails: Array,
            owner: String
        }
    }
}