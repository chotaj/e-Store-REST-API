const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) => {
    const authenticationHeader = req.header.token
    if(authenticationHeader) {
        const token = authenticationHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_CODE, (err, user) => {
            if(err) {
                res.status(403).json("Invalid token")
                req.user = user; 
                next();
            }
        })
    } else {
        return res.status(401).json("Not authenticated")
    }
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req,res,() => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Access denied")
}
    })
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req,res,() => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Access denied")
}
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}