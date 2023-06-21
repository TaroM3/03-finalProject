import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    carts: {
        type: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        },
        _id: false,
    },
    role: String
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel