import { Router } from 'express';
import userController from '../controller/user.controller.js';
import { passportCall } from '../utils.js';

const router = Router()

router.get('/', async(req, res) => {
    res.render('sessions/restore')
})
router.post('/', userController.restore)

router.get('/:uid/:puid',userController.passwordLinkOpened)

router.post('/password', userController.passwordNew)

export default router;