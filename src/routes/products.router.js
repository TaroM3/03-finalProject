import {Router} from "express"
import productModel from "../dao/models/products.model.js"
import productsController from "../controller/products.controller.js"

const router = Router()

router.get("/", productsController.getAllProducts)


router.get("/view", productsController.getRealTime)

router.get("/:id", productsController.getProductById)

router.delete("/:pid", productsController.deleteProductById)

router.post("/", productsController.addNewProduct)

router.put("/:pid", productsController.updateProductById)


export default router