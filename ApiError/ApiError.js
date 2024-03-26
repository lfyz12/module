class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static forbidden() {
        return new ApiError(403, 'Forbidden for you')
    }

    static unauthorized() {
        return new ApiError(401, 'login failed')
    }

    static notFound() {
        return new ApiError(404, 'Not found')
    }

    static badRequest(message) {
        return new ApiError(422, JSON.stringify(message))
    }
}

module.exports = ApiError