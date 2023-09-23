// import UserModel from "../dao/models/user.model.js"
import config from "../config/config.js"
import UserDto from "../dto/userDto.js"
import bcrypt from 'bcrypt'
// import serService from "../services/user.services.js"
import { JWT_COOKIE_NAME, createHash, generateRandomNumber, generateTokenLink, isValidPassword, transporterGmail } from "../utils.js"
import { userService } from "../services/IndexServices.js"



const getUsers = async (req, res) => {
    let results = await userService.get()
    let resultDTO = results.map(user => new UserDto(user))
    res.send(resultDTO)
}

const saveUser = async (req, res) => {
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

const getUser = async (req, res) => {
    let user = extractCookie(req.cookies[JWT_COOKIE_NAME])
    // console.log(req.user)
    // console.log(req.user.user)
    // cookie( JWT_COOKIE_NAME, req.user.token)
    console.log(req.cookies[JWT_COOKIE_NAME])
    verify(req.cookies[JWT_COOKIE_NAME], JWT_PRIVATE_KEY, (err, decoded) => {
        console.log(decoded)

        res.send(JSON.stringify(decoded.user))
    })
}

const login = async (req, res) => {
    if (!req.user) res.status(400).send({ status: 'error', error: 'Invalid credentials' })

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
        let result = await userService.update({ _id: user.id }, { last_connection: date })
        console.log(result)
        res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')

    } catch (err) {
        console.log(err)
        res.send('Logout Error')
    }
}

const restore = async (req, res) => {

    const email = req.body.email

    if (email === '') res.status(500).json({ status: 'Error', message: 'No ingreso el email.' })

    const user = await userService.get({ email: email })
    // console.log(user[0])
    if (user.length < 1) {
        res.status(500).json({ status: 'Error', message: 'El email ingresado no es un usuario.' })
    } else {
        const date = Date.now()
        // const link = generateRandomNumber(user[0]._id, date)
        const link = date
        const message = {
            from: config.mail.gmail,
            to: email,
            subject: 'Compra',
            html: `<h1>Hola mundo</h1> <br> <h3>http://localhost:8080/restore/${user[0]._id}/${link}</h3>`
        }
        const data = {
            link: link,
            last_restore: date
        }
        await userService.update({ email: email }, { restore: data })

        transporterGmail.sendMail(message)
            .then(() => res.status(200).json({ status: 'success', message: 'Email has sent...' }))
            .catch(err => res.status(500).json({ status: 'error', message: err.message }))

    }

}

const passwordLinkOpened = async(req, res) => {
    const passwordLink = req.params.puid
    const userId = req.params.uid
    const user = await userService.get({_id: userId})
    if(user.length < 1) res.status(500).json({status: 'Error', message: 'Link unavailable...'})
    
    const date = Date.now()
    const timeDifference = date - user[0].restore.link
    console.log(timeDifference)
    if(timeDifference >=  3600000){
        res.status(500).json({status: 'Error', message: 'Link has expired'})
    }else{
        if(!req.cookies.tokenRestore){
            const token = generateTokenLink(passwordLink, '1h')
            console.log(token)
            res.cookie('tokenRestore', {token: token, userId: user[0]._id},{
                maxAge: 3600000
            })
            const data = {
                link: passwordLink,
                last_restore: Date.now()
            }
    
            await userService.update({_id: userId}, {restore: data})
            res.render('sessions/password')
        }else{            
            res.render('sessions/password')
        }
    }
    
}

const passwordNew = async( req, res ) => {
    let password = req.body.password
    const passwordRepeated = req.body.passwordRepeated
    const token = req.cookies.tokenRestore

    console.log(password)


    if(password === passwordRepeated) {
        const passwordHashed = createHash(password)

        console.log(passwordHashed)
        const user = await userService.get({_id: token.userId})
        const date = Date.now()
        const timeDifference = date - user[0].restore.link
        if(timeDifference >=  3600000) res.send(500).json({status: 500, message: 'Link has expired'} )
        console.log(user[0].password)
        if(isValidPassword(user[0], passwordHashed)) {
            const result = await userService.update({_id: token.userId}, {password: passwordHashed})
            res.status(200).json({status: 'Success', message: result})
        }else{
            res.status(500).json({status: 'Error', message: 'Write another password...'})
        }
    }else{
        res.status(500).json({status: 'Error', message: 'Password has to match...'})
    }
}


export default { getUsers, saveUser, deleteAdmin, getUser, login, logout, restore, passwordLinkOpened, passwordNew }