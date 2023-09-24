import {Router} from "express"
import productModel from "../dao/models/products.model.js"
import productsController from "../controller/products.controller.js"

const router = Router()

router.get("/", productsController.getProductsView)

router.get('/:pid', productsController.getProductById)

export default router