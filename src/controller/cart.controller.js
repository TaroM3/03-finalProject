import CartModel from "../dao/models/cart.model.js"
import { cartService, productService } from "../services/IndexServices.js"

const getAllCarts = async (req, res) => {
    const carts = await CartModel.find().lean().exec()
    res.json({ carts })
}

const getCartById = async (req, res) => {
    const id = req.params.id
    // const cart = await CartModel.findOne({_id: id})
    const cart = await cartService.get({_id: id})
    res.json({ cart })
}

const createCart = async (req, res) => {
    // const newCart = await CartModel.create({})
    const newCart = await cartService.save({})

    res.json({status: "Success", newCart})
}

const deleteProductFromCart = async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid

    // const cart = await CartModel.findById(cartID)
    const cart = await cartService.get({_id: cartID})
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.findIndex(p => p.id == productID)
    
    if (productIDX <= 0) return res.status(404).json({status: "error", error: "Product Not Found on Cart"})

    cart.products = cart.products.splice(productIDX, 1)
    await cart.save()
    
    res.json({status: "Success", cart})
}

const addProductToCart = async (req, res) => {
    const user = req.userInfo
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity= req.body.quantity || 1
    // const cart = await CartModel.findById(cartID)
    const cart = await cartService.get({_id: cartID})

    const product = await productService.get({_id: productID})
    if(product[0].owner === user.id) res.status(500).json({status: 'Error', message: 'You cant buy your own products...'})
    if(product[0].stock === 0) res.status(500).json({status: 'Error', message: 'This product has not enough stock...'})
    let found = false
    for (let i = 0; i < cart[0].products.length; i++) {
        if (cart[0].products[i].id == productID) {
            cart[0].products[i].quantity++
            found = true
            break
        }
    }

    if(cart[0])

    
    if (found == false) {
        cart[0].products.push({ id: productID, quantity})
    }

    await cart[0].save()

    const userCart = cart[0]

    res.json({status: "Success", userCart})
}

 const getUserCart = async(req , res) => {
    // const userCart = req.userInfo.carts
    const cartId = req.params.ucid

    const cartArray = await cartService.getLeanExec({_id: cartId})
    
    if(cartArray.length < 1) res.status(500).json({status: 'Error', message: 'This cart does not exist. . . '})
    const data = {
        ...cartArray[0]
    }

    console.log(data)

    res.status(200).json({status: 'Success', message: data})
    // res.render('cartView', { data: data})
 }

export default { getAllCarts, getCartById, createCart, deleteProductFromCart, addProductToCart, getUserCart }