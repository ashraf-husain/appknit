const jwt = require('jsonwebtoken')

module.exports = {
    checkLogin: (req, res, next) => {
        try{
            const { authorization } = req.headers
            const authToken = authorization.split('Bearer ')[1]
            const verifyObj = jwt.verify(authToken, process.env.ENC_KEY)
            req.userId = verifyObj._id
            next()
        } catch(err) {
            console.log("Error", err)
            return res.status(403).json({ success: false, message: err.message })
        }
    }
}