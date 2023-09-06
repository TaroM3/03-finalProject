import ProductModel from "../dao/models/products.model.js";
import Repository from "./Repository.js";


export default class ProductService extends Repository{
    constructor(dao) {
        super(dao, ProductModel.model)
    } 
}