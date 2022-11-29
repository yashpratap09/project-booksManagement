const userModel = require("../Models/userModel")
const { isValidName, isValidEmail, isValidNumber, isValidPassward, forName } = require("../validator/validator")
const jwt = require('jsonwebtoken')


//--- Post Api for User Creation ---

const createdUser = async function (req, res) {
    try {
        let data = req.body
        const { title, name, phone, email, password } = data

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "plz provide data" })
        if (!title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
        if (!name) { return res.status(400).send({ status: false, message: "name is mandatory" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "phone no is mandatory" }) }
        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }
        if (!password) {return res.status(400).send({ status: false, message: "password is mandatory"}) }

        if (!isValidName(title)) return res.status(400).send({ status: false, message: "plz provide title" })
        if (!["Miss", "Mrs", "Mr"].includes(title)) return res.status(400).send({ status: false, message: "title takes only Mr, Miss, Mrs" })

        if (!forName(name)) return res.status(400).send({ status: false, message: "name is not valid" })
        if (!isValidNumber(phone)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        if (!isValidPassward(password)) return res.status(400).send({ status: false, message: "password is not valid" })

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: "email is already registered" })

        let uniquePhn = await userModel.findOne({ phone: phone })
        if (uniquePhn) return res.status(400).send({ status: false, message: "phone no is already registered" })

        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//--- Sign In ---


const userLogin = async function (req, res) {
    try {
        let credentials = req.body
        let { email, password } = credentials
        if (Object.keys(credentials) == 0) {
            return res.status(400).send({ status: false, message: "email and password are required" })
        }
        if (email.length == 0 || password.length == 0) {
            return res.status(400).send({ status: false, message: "both fields are required." })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "invalid email" })
        }
        if (!isValidPassward(password)) {
            return res.status(400).send({ status: false, message: "invalid password" })
        }

        let userDetail = await userModel.findOne({ email: email, password: password }) //Or nahi lagana
        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found with this EmailId and Password" })

        }

        
        let token = jwt.sign({
            email: userDetail.email,
            password: userDetail.password,
            id: userDetail._id.toString(),

        }, "project/booksManagementGroup22",{ expiresIn: '30s' })
        res.setHeader("x-api-key", token)


        return res.status(200).send({ status: true, message: "Success", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.userLogin = userLogin
module.exports.createdUser = createdUser