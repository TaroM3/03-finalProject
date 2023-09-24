import productModel from "../dao/models/products.model.js"
import {productService} from "../services/IndexServices.js"

const getAllProducts = async (req, res) => {
    // const products = await productModel.find().lean().exec()
    const products = await productService.get()
    const limit = req.query.limit || 5
    
    res.json(products.slice(0, parseInt(limit)))
    
}

const getProductById = async(req, res) => {
    const id = req.params.pid
    const productA = await productService.getLeanExec({_id: id})

    // res.json({
    //     product
    // })
    const data = {
        ...productA[0]
    }
    console.log(data)
    res.render('productView', {data})
}

const deleteProductById = async(req, res) => {
    const id = req.params.pid
    const productDeleted = await productService.delete({_id: id})

    // req.io.emit('updatedProducts', await productService.find().lean().exec())
    req.io.emit('updatedProducts', await productService.getLeanExec());
    res.json({
        status: 'Success',
        message: 'Product Deleted!',
        productDeleted
    })
}


const addNewProduct = async (req, res) => {
    try {
        const product = req.body
        if (!product.title) {
            return res.status(400).json({
                message: "Error Falta el nombre del producto"
            })
        }
        const productAdded = await productModel.create(product)
        // req.io.emit('updatedProducts', await productModel.find().lean().exec());
        req.io.emit('updatedProducts', await productService.getLeanExec());
        res.json({
            status: "Success",
            productAdded
        })
    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
}

const updateProductById = async (req, res) => {
    const id = req.params.pid
    const productToUpdate = req.body

    const product = await productModel.updateOne({
        _id: id
    }, productToUpdate)
    // req.io.emit('updatedProducts', await productModel.find().lean().exec());
    req.io.emit('updatedProducts', await productService.getLeanExec());
    res.json({
        status: "Success",
        product
    })
}

const getRealTime = async (req, res) => {
    // const products = await productModel.find().lean().exec()
    const products = await productService.getLeanExec()
    res.render('realTimeProducts', {
        data: products
    })
}

const getProductsView = async (req, res) => {

    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    let filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    let search = {}
    if(filter) {
        // search.title = 'Durian'
        // search.title = /^durian$/i
        search = { title : { $regex: new RegExp(`^${filter}$`), $options: 'i' } }
        console.log(search)
    }
    let sort = {}
    if (sortQuery) {
        // sort[sortQuery] = sortQueryOrder
        sort = { [sortQuery] : sortQueryOrder }
        // console.log(sort)
    }

    const options = {
        limit, 
        page, 
        sort,
        lean: true
    }
    
    // const data = await productModel.paginate(search, options)
    const data = await productService.getPagination({}, search, options)
    console.log(JSON.stringify(data, null, 2, '\t'));

    const user = req.user.user
    
    const front_pagination = []
    for (let index = 1; index <=data.totalPages; index++) {
        front_pagination.push({
            page: index,
            active: index == data.page
        })
    }

    res.render('products', {data, user, front_pagination})
}

export default { getProductById, deleteProductById, addNewProduct, updateProductById, getAllProducts, getRealTime, getProductsView }
