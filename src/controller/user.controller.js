import UserModel from "../dao/models/user.model.js"
import config from "../config/config.js"

const getUsers = async(req, res) => {
    let results = await userService.get()
    res.send(results)
}

const saveUser = async(req, res) => {
    let result = await userService.save(req.body)
}

const deleteAdmin = async (req, res) => {
    if (await UserModel.findOne({email: config.admin.adminEmail})) {
        await UserModel.deleteOne({email: config.admin.adminEmail})
    }
    res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
}

export default { getUsers, saveUser, deleteAdmin }