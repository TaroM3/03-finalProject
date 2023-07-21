import UserModel from "../dao/models/user.model.js";

export default class Service {
    constructor(dao) {
        super(dao, UserModel.model)
    }
}