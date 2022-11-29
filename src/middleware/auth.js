const jwt = require("jsonwebtoken")

//================================================Authentication======================================================

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]

        if (!token) {
            return res.status(400).send({ status: false, message: "token must be present in headers" })
        }
        else {
            decodedToken =jwt.verify(token,"project/booksManagementGroup22",function(err, decodedToken) {
                if (err) {
                    return res.status(401).send({ status: false, message: "Authontication faild" })
                }
                else {
                    req.loginUserId = decodedToken.id
                    if (decodedToken.exp > Date.now()) {
                        next()
                    }
                    else {
                        return res.status(401).send({ status: false, message: "token has been expired" })
                    }
                }
            })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const authorisation  = async function (req, res, next) {
    try {
        let yash = req.loginUserId
        console.log(yash)
        // let newbookId =  



    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



module.exports.authenticate= authenticate
module.exports.authorisation = authorisation