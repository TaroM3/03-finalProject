import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt, { verify } from 'jsonwebtoken'
import passport from 'passport'
import UserDto from './dto/userDto.js'
import nodemailer from 'nodemailer'
import config from './config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname
export const JWT_PRIVATE_KEY = 'secret'
export const JWT_COOKIE_NAME = 'coderCookieToken'

export const createHash = (password) => {
    // return (bcrypt.hashSync(password, bcrypt.genSaltSync(10)))
    //  const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) 
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h'})
    return token
}

export const generateTokenLink = (user, hour) => {
    const token = jwt.sign({user}, JWT_PRIVATE_KEY, {expiresIn: hour})
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.message : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}

export const createUniqueCode = (id) => {
    return bcrypt.hashSync(id, bcrypt.genSaltSync(10))
}

export const userInfo = (req, res, next) => {
    console.log(req.cookies[JWT_COOKIE_NAME])
    verify(req.cookies[JWT_COOKIE_NAME], JWT_PRIVATE_KEY, (err, decoded) =>{
        console.log(decoded)
        let userDto = new UserDto(decoded.user)
        req.userInfo = userDto
        next()
    })
}

export const configGmail = {
    service: 'gmail',
    auth: {
        user: config.mail.gmail,
        pass: config.mail.password
    }
}

export const transporterGmail = nodemailer.createTransport(configGmail)


export const sender = () => {
    
    const message = {
        from: config.mail.gmail,
        to: 'taro.melillo@gmail.com',
        subject: 'Hola',
        html: '<h1>Hola mundo</h1>'
    }
    // const message = {
    //     from: '',
    //     to: '',
    //     subject: subject,
    //     html: html
    // }
    transporterGmail.sendMail(message)
}

// transporter.sendMail(message)

export const generateRandomNumber = (userId, date) => {
    const data = userId + date.toString()
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10))
}