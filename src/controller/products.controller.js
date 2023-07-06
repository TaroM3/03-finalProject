import productModel from "../dao/models/products.model.js"


const getAllProducts = async (req, res) => {
    const products = await productModel.find().lean().exec()
    const limit = req.query.limit || 5
    
    res.json(products.slice(0, parseInt(limit)))
    
}

const getProductById = async(req, res) => {
    const id = req.params.id
    const product = await productModel.findOne({_id: id})

    res.json({
        product
    })
}

const deleteProductById = async(req, res) => {
    const id = req.params.pid
    const productDeleted = await productModel.deleteOne({_id: id})

    req.io.emit('updatedProducts', await productModel.find().lean().exec())

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
        req.io.emit('updatedProducts', await productModel.find().lean().exec());
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
    req.io.emit('updatedProducts', await productModel.find().lean().exec());
    res.json({
        status: "Success",
        product
    })
}

const getRealTime = async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts', {
        data: products
    })
}

const getProductsView = async (req, res) => {

    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    const search = {}
    if(filter) {
        search.title = filter
    }
    const sort = {}
    if (sortQuery) {
        sort[sortQuery] = sortQueryOrder
    }

    const options = {
        limit, 
        page, 
        sort,
        lean: true
    }
    
    const data = await productModel.paginate(search, options)
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
