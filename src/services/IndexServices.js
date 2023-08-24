import config from "../config/config.js";
import MongoDAO from "../dao/models/mongoDAO.js";
import UserService from "./user.services.js";



let dao

switch (config.app.persistence) {
    case "MONGO":
        dao = new MongoDAO(config)
        break;

}

export const userService = new UserService(dao)
