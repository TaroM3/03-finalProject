import { Router } from "express"
import CartManager from "../dao/manager/cart_manager.js"
import cartModel from "../dao/models/cart.model.js"
import cartController from "../controller/cart.controller.js"

const cartManager = new CartManager("carts.json")

const router = Router()

router.get("/", cartController.getAllCarts)

router.get("/:id", cartController.getCartById )

router.post("/", cartController.createCart)

router.delete("/:cid/product/:pid", cartController.deleteProductFromCart)

router.post("/:cid/product/:pid", cartController.addProductToCart)

export default router