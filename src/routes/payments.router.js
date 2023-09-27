import {Router} from 'express'

import paymentsController from '../controller/paymets.controller.js'
import { userInfo } from '../utils.js'

const router = Router()

router.get('/', async(req, res) => res.status(200).json('testing route'))

router.post('/payment-intents', paymentsController.processPayment)
//////////////////////////
router.get('/checkout', userInfo, paymentsController.checkout);

router.get('/success', paymentsController.success);

router.get('/cancel', paymentsController.cancel);
/////////////////////////


export default router;

