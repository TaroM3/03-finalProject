import passport from "passport";
import local from "passport-local"
import passport_jwt, { ExtractJwt } from "passport-jwt";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword, generateToken, extractCookie, JWT_COOKIE_NAME } from '../utils.js'
import { JWT_PRIVATE_KEY } from "../utils.js";
import CartModel from "../dao/models/cart.model.js";
import config from "./config.js";
import { cartService, userService } from "../services/IndexServices.js";
import { verify } from "jsonwebtoken";
import UserDto from "../dto/userDto.js";

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy

const initializePassport = () => {


    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const {first_name, last_name, email, age } = req.body

        if (email === config.admin.adminEmail) {
            return done(null, false)    
        }

        try {
            // const user = await UserModel.findOne({email: username})
            const user = await userService.get({email: username})
            console.log(user)
            if(user.length > 0) {
                console.log("User already exits");
                return done(null, false)
            }

            // const cartID = (await CartModel.create({}))._id.toString()
            // console.log(cartID)
            // const cart = CartModel.findById(cartID)

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                carts: {id: (await cartService.save({}))._id.toString()},
                role: 'user',
                restore: {link: '', last_restore: ''}
            }
            // newUser.cart.push({id: cartID})
            // const result = await UserModel.create(newUser)
            const result = await userService.save(newUser)
            
            return done(null, result)
        } catch (error) {
            return done("[LOCAL] Error al obtener user " + error)
        }


    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {

        if (username === config.admin.adminEmail) {
            if (password === config.admin.adminPassword) {

                const user = {
                    first_name: 'Lautaro',
                    last_name: 'Melillo',
                    age: 29, 
                    email: username,
                    password: createHash(password),
                    role: 'admin'
                }
                await userService.save(user)


                const adminUser = await userService.get({email: username})
                const token = generateToken(user)
                adminUser.token = token
                return done(null, adminUser)
            } else {
                return done(null, false)
            }
        }
        try {
            // const user = await UserModel.findOne({email: username})
            const user = await userService.get({email: username})
            console.log(user)
            if(user.length <= 0) {
                console.log("User doesnt exist");
                return done(null, user)
            }

            const date = Date.now()
            console.log(date)
            await userService.update({_id: user[0]._id}, {last_connection: date})

            if(!isValidPassword(user[0], password)) return done(null, false)

            const token = generateToken(user[0])
            user[0].token = token

            return done(null, user[0])
        } catch (error) {
            return done(null, false)
        }
    }))

    // passport.use('/restore', new LocalStrategy({}))

    // passport.use('')s

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        // const user = await UserModel.findById(id)
        const user = await userService.get({_id: id})
        done(null, user)
    })


}

export default initializePassport;