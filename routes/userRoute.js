const Router = require('express')
const UserController = require('../controllers/UserController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const router = new Router()

router.post('/create', UserController.create)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

module.exports = router