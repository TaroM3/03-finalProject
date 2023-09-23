import { JWT_COOKIE_NAME } from "../utils.js"

export const isLoggedIn = (req, res, next) => {
    if(req.cookies[JWT_COOKIE_NAME]) return res.redirect('/products')
    next()
}

export const isNotLoggedIn = (req, res, next) => {
    if(!req.cookiesp[JWT_COOKIE_NAME]) return res.redirect('/')
}