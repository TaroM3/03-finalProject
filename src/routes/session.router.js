import { Router } from "express";
import passport from "passport";
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY, extractCookie, userInfo } from "../utils.js";
import cookieParser, { JSONCookie } from "cookie-parser";
import UserModel from "../dao/models/user.model.js";
import config from "../config/config.js";
import userController from "../controller/user.controller.js";
import { verify } from "jsonwebtoken";
import UserDto from "../dto/userDto.js";
// import UserDto from "../dto/userDto.js";
// import userController from "../controller/user.controller.js";

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})
router.get('/failregister', (req, res) => {
    console.log('Fail Strategy');
    res.send({ error: "Failed" })
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), userController.login)

// async (req, res) => {
//     if (!req.user) {
//         return res.status(400).send({ status: "error", error: "Invalid credentials" })
//     }
//     // req.session.user = {
//     //     first_name: req.user.first_name,
//     //     last_name: req.user.last_name,
//     //     email: req.user.email,
//     //     age: req.user.age,
//     // }

//     res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
// })
router.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})

// router.get('/profile', (req, res) => {
//     res.json(req.session.user)
// })

// Cerrar Session
router.get('/logout', userInfo, userController.logout)
// async (req, res) => {
//     // if (await UserModel.findOne({email: config.admin.adminEmail})) {
//     //     await UserModel.deleteOne({email: config.admin.adminEmail})
//     // }
//     res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')

// })
    // req.session.destroy(err => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).render('errors/base', { error: err })
    //     } else res.redirect('/session/login')
    // })
// router.get('/current', (req, res) => {
//     // console.log(req.user)
//     // console.log(req.user.user)
//     // cookie( JWT_COOKIE_NAME, req.user.token)
//     // let user = extractCookie(req.cookies[JWT_COOKIE_NAME])
//     console.log(req.cookies[JWT_COOKIE_NAME])
//     verify(req.cookies[JWT_COOKIE_NAME], JWT_PRIVATE_KEY, (err, decoded) =>{
//         console.log(decoded)
//         let userDto = new UserDto(decoded.user)
//         res.send(JSON.stringify(userDto))
//     })
// })

router.get('/current', userInfo , async(req, res) => {

    res.send(JSON.stringify(req.userInfo))
})
    // res.json(req.user)
    // res.cookie(JWT_COOKIE_NAME, req)
    // res.json(req.cookies.JWT_COOKIE_NAME)
    // res.json(user)
    // res.extractCookie(req.cookies[JWT_COOKIE_NAME])

export default router