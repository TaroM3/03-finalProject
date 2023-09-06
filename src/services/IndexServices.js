import config from "../config/config.js";
import MongoDAO from "../dao/models/mongoDAO.js";
import UserService from "./user.services.js";
import ProductService from "./product.services.js";
import CartService from "./cart.services.js";



let dao

switch (config.app.persistence) {
    case "MONGO":
        dao = new MongoDAO(config)
        break;

}

export const userService = new UserService(dao)
export const productService = new ProductService(dao)
export const cartService = new CartService(dao)
