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

// const upload = multer({ dest: '../uploads/'})
router.get("/premium/:uid", userInfo, async(req, res) => {
    let user = req.userInfo
    res.render('user', {user} )
})

router.post('/:uid/documents', upload.single('avatarImage'), userInfo, async(req, res) => {
    console.log(req.body)
    let avatar = '/uploads/profiles/'+ req.file.filename
    req.userInfo.avatar = avatar
    let user = req.userInfo
    userService.update({_id: user.id}, {avatar: avatar})
    res.render('user', {user})
})

export default router