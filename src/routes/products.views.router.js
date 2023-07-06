import {Router} from "express"
import productModel from "../dao/models/products.model.js"
import productsController from "../controller/products.controller.js"

const router = Router()

router.get("/", productsController.getProductsView)

export default router