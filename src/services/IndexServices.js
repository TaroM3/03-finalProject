import config from "../config/config";
import MongoDAO from "../dao/models/mongoDAO.js";



let dao

switch (config.app.persistence) {
    case "MONGO":
        dao = new MongoDAO(config.mongo.url)
        break;

    default:
        break;
}
