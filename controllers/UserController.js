const ApiError = require("../ApiError/ApiError")
const UserDto = require("../dto/userDto")
const {Users} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateToken = (payload) => jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '60m'})
class UserController {
    async create(req, res, next) {
            try {
                const {id, first_name, last_name, email, password} = req.body

                if (!first_name || !last_name || !email || !password) {
                    return next(ApiError.badRequest({
                        success: false,
                        message: 'Не все данные введены коректно'                
                    }))
                }
                
                if (password.length < 3) {
                    return next(ApiError.badRequest({
                        success: false,
                        message: 'Некоректно введен пароль'                
                    }))
                }

                const hasLowercase = /[a-z]/.test(password);

                const hasUppercase = /[A-Z]/.test(password);

                if (!hasLowercase || !hasUppercase) {
                    return next(ApiError.badRequest({
                        success: false,
                        message: 'Некоректно введен пароль'                
                    }))
                }

                const candidate = await Users.findOne({where: {email: email}})
        
                if (candidate) {
                    return next(ApiError.badRequest('Пользователь с такой почтой уже существует'))
                }
        
                const hashpassword = await bcrypt.hash(password, 5)
                const user = await Users.create({first_name, last_name, email, password: hashpassword, token: generateToken({id, first_name, last_name, email})})
                return res.json({
                    'success': true,
                    'message': 'Success',
                    token:  user.token
                })
            } catch(e) {
                next(ApiError.badRequest(e.message))
            }   
        }

    async login(req, res, next) {
        try {
            const {email, password} = req.body

            const user = await Users.findOne({where: {email: email}})
    
            if (!user) {
                return next(ApiError.unauthorized())
            }
    
            const decodePasword = bcrypt.compareSync(password, user.password)
    
            if (!decodePasword) {
                return next(ApiError.unauthorized())
            }
    
            const userDto = new UserDto(user)
            const token = generateToken({...userDto})
    
            return res.json({
                'success': true,
                'message': 'Success',
                token:  user.token
            })
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async logout(req, res, next) {
        const deleteToken = await Users.update({token: null}, {where: {id: req.user.id}})
        return res.json({
            'success': true,
            'message': 'Logout',
        })
    }
        
}

module.exports = new UserController()