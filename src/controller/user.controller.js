import UserModel from "../dao/models/user.model.js"
import config from "../config/config.js"
import UserDto from "../dto/userDto.js"
import UserService from "../services/user.services.js"


const userService = new UserService()

const getUsers = async(req, res) => {
    let results = await userService.get()
    let resultDTO = results.map(user => new UserDto(user))
    res.send(resultDTO)
}

const saveUser = async(req, res) => {
    let user = req.body
    let result = await userService.save(user)
    // let result = await UserService.addUser(user)
    res.send(result) 
}

const deleteAdmin = async (req, res) => {
    // if (await UserModel.findOne({email: config.admin.adminEmail})) {
    //     await UserModel.deleteOne({email: config.admin.adminEmail})
    // }
    res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
}

const getUser = async(req, res) => {
    let user = extractCookie(req.cookies[JWT_COOKIE_NAME])
    // console.log(req.user)
    // console.log(req.user.user)
    // cookie( JWT_COOKIE_NAME, req.user.token)
    console.log(req.cookies[JWT_COOKIE_NAME])
    verify(req.cookies[JWT_COOKIE_NAME], JWT_PRIVATE_KEY, (err, decoded) =>{
        console.log(decoded)
        
        res.send(JSON.stringify(decoded.user))
    })
}

export default { getUsers, saveUser, deleteAdmin, getUser }