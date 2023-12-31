import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import chatRouter from "./routes/chat.router.js"
import messagesModel from "./dao/models/messages.model.js";
import productViewsRouter from './routes/products.views.router.js'
import sessionRouter from './routes/session.router.js'
import { passportCall, userInfo } from "./utils.js";
import userRouter from "./routes/user.router.js"
import restoreRouter from './routes/restore.router.js'
import paymentsRouter from './routes/payments.router.js'

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    app.use("/products", passportCall('jwt'), userInfo, productViewsRouter)
    app.use("/session", sessionRouter)
    app.use("/restore", restoreRouter)


    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/chat", chatRouter)
    app.use("/api/users", userRouter)
    app.use("/api/payments", paymentsRouter)

    app.use('/api/session', passportCall('jwt'), sessionRouter)

    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await messagesModel.create(data)
        let messages = await messagesModel.find().lean().exec()
        socketServer.emit("logs", messages)
        })
    })

    app.use("/", (req, res) => res.redirect("/session/login"))

}

export default run