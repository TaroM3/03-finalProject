import Stripe from "stripe";
import config from "../../config/config.js";

const STRIPE_KEY = config.stripe.key
export default class PaymentService {
    constructor(){
        this.stripe = new Stripe(STRIPE_KEY)
    }

    async createPaymentIntent(data){
        return this.stripe.paymentIntents.create(data);
    }

    get = () => {
        return this.stripe
    }
}


