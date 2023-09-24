import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";

import __dirname from "./utils.js"
import run from "./run.js";

import dotenv from 'dotenv'
import config from "./config/config.js";
import program from "./commander.js";


const app = express()

// program.option('-d <persistence>', 'Persistence', config.environment.development)

// program.parse()
// const persistance = program.opts().persistance
// console.log(program.opts().)
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

// const MONGO_URI = "mongodb+srv://taromelillo:Hw8C2a43e6CXWHK6@cluster0.4lcw6qm.mongodb.net/"
// const MONGO_DB_NAME = "ecommerce"
// const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = config.mongo.url
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME
const MONGO_DB_NAME = config.mongo.dbName

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: MONGO_URI,
    //     dbName: MONGO_DB_NAME
    // }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
}, (error) => {
    if(error){
        console.log("Database's not conected...")
        return
    }
    // console.log(program.opts().pers)
    console.log(config.mongo.dbName)
    const httpServer = app.listen(8080, () => console.log("SERVER :  Listening..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))

    run(socketServer, app)
})



