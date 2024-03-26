const ApiError = require("../ApiError/ApiError")

module.exports = function(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json(JSON.parse(err.message))
    }
    return res.status(500).json({message: 'Oops! Error'})
}