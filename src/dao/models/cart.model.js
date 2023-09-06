import mongoose from "mongoose";


export default class CartModel {
    static get model() {
        return 'carts'
    }
    
    static get schema() {
        return {
            products: {
                        type: [{
                            id: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "products"
                            },
                            quantity: Number
                        }],
                        default: [],
                        _id: false,
                    }
        }
    }
}
  
// const cartCollection = "carts"
// const cartSchema = new mongoose.Schema({
//     products: {
//         type: [{
//             id: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "products"
//             },
//             quantity: Number
//         }],
//         default: [],
//         _id: false,
//     }
// })

// mongoose.set("strictQuery", false)
// const CartModel = mongoose.model(cartCollection, cartSchema)

// export default CartModel