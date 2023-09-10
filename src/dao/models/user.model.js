import mongoose from "mongoose";

// const userCollection = "users"

export default class UserModel {
    static get model() {
        return "users"
    }

    static get schema() {
        return {
            first_name: String,
            last_name: String,
            email: String,
            age: Number,
            password: String,
            carts: {
                type: {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "carts"
                    }
                },
                _id: false,
            },
            role: String,
            documents: [{
                name: String,
                reference: String 
                }],
            last_connection: {type: Date, default: Date.now}
        }
    }
}

// const userSchema = new mongoose.Schema({
//     first_name: String,
//     last_name: String,
//     email: String,
//     age: Number,
//     password: String,
//     carts: {
//         type: {
//             id: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'carts'
//             }
//         },
//         _id: false,
//     },
//     role: String
// })

// mongoose.set("strictQuery", false)
// const UserModel = mongoose.model(userCollection, userSchema)

// export default UserModel