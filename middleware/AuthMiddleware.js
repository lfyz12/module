const ApiError = require("../ApiError/ApiError")
const jwt = require('jsonwebtoken')
module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.unauthorized())
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded) {
            return next(ApiError.unauthorized())
        }

        req.user = decoded
        next()
    } catch(e) {
        return next(ApiError.unauthorized())
    }
}