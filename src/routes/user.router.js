import { Router } from "express";
import { userInfo } from "../utils.js";
import multer from "multer";
import { userService } from "../services/IndexServices.js";




const router = Router()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/png') {
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // file.path
        // let user = req.userInfo
      cb(null, 'src/public/uploads/profiles/')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
})


router.get('/', async(req, res) => {
    res.send('Muestra todos los usuarios')
})

router.get('/')
// const upload = multer({ dest: '../uploads/'})
router.get('/premium/:uid', userInfo, async(req, res) => {
    const userId = req.userInfo.id
    try {
        const user = await userService.get({_id: userId})
        const avatar = user[0].documents.map(document => {if(document.name === 'avatar') return document.reference}) 
        const data = {user: req.userInfo, avatar: avatar}
        res.render('user', data)
    } catch (error) {
        res.send('Error: ', error)
    }
})

router.post('/premium/:uid/documents', upload.single('avatarImage'), userInfo, async(req, res) => {
    // console.log(req.body)
    const avatar = '/uploads/profiles/'+ req.file.filename
    req.userInfo.avatar = avatar

    const user = req.userInfo
    const userInstance = await userService.get({_id: user.id})
    console.log(userInstance)
    const data = {
        name: avatar, reference: avatar
    }
    
    userInstance[0].documents.push(data)
    const result = await userService.update({_id: user.id}, {documents: userInstance[0].documents})
    res.render('user', {user})
})

export default router