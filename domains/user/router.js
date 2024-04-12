const express = require('express')
const UserController = require('./controller')
const { boundInstance } = require('../../services/utils/oop')
const { authGuard } = require('../../services/authorization/authGuard')
const router = express.Router()

const multer = require('multer')
var upload = multer({ dest: './Assets/profiles/' })

let userController = new UserController()
userController = boundInstance(userController)

router.get('/', userController.get)
router.get('/token', authGuard, userController.getMe)
router.get('/specific', userController.getUserByUserName)
router.get('/id', userController.getUserById)
router.post('/', userController.create)
router.post('/verify/phone', authGuard, userController.sendCodeToPhone)
router.post('/verify/email', authGuard, userController.sendCodeToEmail)
router.post('/verify/check', authGuard, userController.checkVerificationCode)
router.post('/login', userController.loginUser)
router.post('/update', authGuard, userController.update)
router.post('/changepassword', authGuard, userController.changePassword)
router.post('/addpicture', upload.single('profile'), authGuard, userController.changeProfilePicture)
router.post('/activate', userController.activate)
router.post('/deactivate', userController.deactivate)
router.delete('/delete/permanent', userController.delete)

module.exports = router
