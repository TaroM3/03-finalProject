import CartModel from "../dao/models/cart.model.js";
import Repository from "./Repository.js";


export default class CartService extends Repository{
    constructor(dao) {
        super(dao, CartModel.model)
    }
}