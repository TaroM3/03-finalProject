import passport from "passport";
import local from "passport-local"
import passport_jwt, { ExtractJwt } from "passport-jwt";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword, generateToken, extractCookie } from '../utils.js'
import { JWT_PRIVATE_KEY } from "../utils.js";
import CartModel from "../dao/models/cart.model.js";
import config from "./config.js";
import { userService } from "../services/IndexServices.js";

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
                carts: {id: (await CartModel.create({}))._id.toString()},
                role: 'user'
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
                await UserModel.create(user)


                const adminUser = await UserModel.findOne({email: username})
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
            if(user.length > 0) {
                console.log("User doesnt exist");
                return done(null, user)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            
        }
    }))

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