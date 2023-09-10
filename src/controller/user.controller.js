import UserModel from "../dao/models/user.model.js"
import config from "../config/config.js"
import UserDto from "../dto/userDto.js"
// import serService from "../services/user.services.js"
import { JWT_COOKIE_NAME } from "../utils.js"
import { userService } from "../services/IndexServices.js"



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

const login = async(req, res) => {
    if(!req.user) res.status(400).send({status: 'error', error: 'Invalid credentials'})

    // await userService.update({_id: req.userInfo.id}, {last_connection: Date.now()})
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

const logout = async (req, res) => {
    // if (await userService.get({email: config.admin.adminEmail})) {
    //     await userService.delete({email: config.admin.adminEmail})
    // }

    try {
        const user = req.userInfo
        // console.log(user)
        const date = Date.now()
        console.log(date)
        let result = await userService.update({_id: user.id}, {last_connection: date})
        console.log(result)
        res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
        
    } catch (err) {
        console.log(err)
        res.send('Logout Error')
    }
}
export default { getUsers, saveUser, deleteAdmin, getUser, login, logout }