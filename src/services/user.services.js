import UserModel from "../dao/models/user.model.js";
import Repository from './Repository.js'

export default class UserService extends Repository{
    constructor(dao) {
        super(dao, UserModel.model)
    }
}