import { Router } from "express";
import passport from "passport";
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY, extractCookie, userInfo } from "../utils.js";
import cookieParser, { JSONCookie } from "cookie-parser";
import UserModel from "../dao/models/user.model.js";
import config from "../config/config.js";
import userController from "../controller/user.controller.js";
import { verify } from "jsonwebtoken";
import UserDto from "../dto/userDto.js";
// import { userService } from "../services/IndexServices.js";
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



router.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})



// Cerrar Session
router.get('/logout', userInfo, userController.logout)


router.get('/current', userInfo , async(req, res) => {

    res.send(JSON.stringify(req.userInfo))
})

// router.get('/restore', async(req, res) => {
//     res.render('sessions/restore')
// })

// router.post('/restore', userController.restore)

// router.get('/:uid/:puid', userController.passwordLinkOpened)

export default router