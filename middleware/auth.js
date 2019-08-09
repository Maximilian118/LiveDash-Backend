const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(" ")[1] // Extract token string from "Bearer Token".
    if (!token || token === "") {
        req.isAuth = false
        return next()
    }
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY)
    } catch (err) {
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req._id = decodedToken._id
    next()
}
