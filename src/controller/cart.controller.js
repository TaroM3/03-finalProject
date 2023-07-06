import CartModel from "../dao/models/cart.model.js"

const getAllCarts = async (req, res) => {
    const carts = await CartModel.find().lean().exec()
    res.json({ carts })
}

const getCartById = async (req, res) => {
    const id = req.params.id
    const cart = await CartModel.findOne({_id: id})
    res.json({ cart })
}

const createCart = async (req, res) => {
    const newCart = await CartModel.create({})

    res.json({status: "Success", newCart})
}

const deleteProductFromCart = async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid

    const cart = await CartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.findIndex(p => p.id == productID)
    
    if (productIDX <= 0) return res.status(404).json({status: "error", error: "Product Not Found on Cart"})

    cart.products = cart.products.splice(productIDX, 1)
    await cart.save()
    
    res.json({status: "Success", cart})
}

const addProductToCart = async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity= req.body.quantity || 1
    const cart = await CartModel.findById(cartID)

    let found = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id == productID) {
            cart.products[i].quantity++
            found = true
            break
        }
    }
    if (found == false) {
        cart.products.push({ id: productID, quantity})
    }

    await cart.save()


    res.json({status: "Success", cart})
}

export default { getAllCarts, getCartById, createCart, deleteProductFromCart, addProductToCart }