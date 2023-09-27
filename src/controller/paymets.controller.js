import { cartService } from "../services/IndexServices.js"
import PaymentService from "../services/payments/payments.service.js"
// import Stripe from "stripe"

const paymentService = new PaymentService()

// const stripe = Stripe('sk_test_51NnLTWGHs0Uv1JKU9jMmDpAEHzd96aNoK4TjAc2uAzQZBLMOwVhQpYjua8CWeoFfd79LKuu45jdHC0vXwn1zRU9I00NO1u2kqR')

const processPayment = async( req, res ) => {


    const result = paymentService.createPaymentIntent()
    res.status(200).json({status: 'Success', payload: result})
}

const checkout = async(req, res)=> {

    const cartId = req.userInfo.carts
    
    const carts = await cartService.getLeanExec({_id: cartId})

    const products = carts[0].products.map(element => element)

    const items = []
    for (let index = 0; index < products.length; index++) {
        // const element = products[index].quantity;
        // console.log(element)
        items.push({
            price_data: {
                product_data: {
                    name: products[index].id.title,
                    description: products[index].id.description
                },
                currency: 'usd',
                unit_amount: (products[index].id.price * 100)
            },
            quantity: products[index].quantity
        }) 
    }
    // res.json(items)

    const session = await paymentService.get().checkout.sessions.create({
        line_items:[
            // {
            //     price_data: {
            //         product_data: {
            //             name: 'Heladera',
            //             description: 'Congela todo'
            //         },
            //         currency: 'usd',
            //         unit_amount: 2000
            //     },
            //     quantity: 3
            // }
            ...items
        ],
        mode: 'payment',
        success_url: 'http://localhost:8080/api/payments/success',
        cancel_url: 'http://localhost:8080/api/payments/cancel'
    })

    return res.redirect(session.url)
}

const success = async(req, res) => {
    res.send('Pago Exitoso. . . ')
}

const cancel = async(req, res) =>{
    res.send('Pago fallido. . . ')
}

export default { processPayment, checkout, success, cancel }