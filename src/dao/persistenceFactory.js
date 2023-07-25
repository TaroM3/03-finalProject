import config from "../config/config.js";

export default class PersistenceFactory {
    static getPersistence = async(persistence) => {
        switch (persistence) {
            case "DEVELOPMENT":
                
                break;
        
            case "PRODUCTION":

                break;

            default:
                break;
        }
    }
}