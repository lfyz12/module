const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            //const {accessToken} = req.cookies
            //const token = accessToken
            const token = req.headers.authorization.split(' ')[1] // Bearer asdfdsgksld
            let roleCheacked = false
            if (!token) {
                return next(ApiError.unauthorized())
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (!decoded) {
                return next(ApiError.forbidden())
            }
            role.forEach(item => {
                if (decoded.role == item) {
                    roleCheacked = true
                }
            })
            if (roleCheacked === false) {
                return next(ApiError.forbidden())
            }
            roleCheacked = false
            req.user = decoded
            next()
        } catch (e) {
            return next(ApiError.forbidden())
        }
    }
}






