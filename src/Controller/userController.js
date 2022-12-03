const userModel = require("../Models/userModel")
const { isValidName, isValidEmail, isValidNumber, isValidPassword, forName,pincodes } = require("../validator/validator")
const jwt = require('jsonwebtoken')


//--- Post Api for User Creation ---
//=========================================<== CREATER USRER API==>==============================================================//
const createdUser = async function (req, res) {
    try {
        let data = req.body
        const { title, name, phone, email, password ,address } = data

    //===========================validation for Key and Value present or Not=============================================// 

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "plz provide data" })
        if (!title) { return res.status(400).send({ status: false, message: "title is mandatory" }) }
        if (!name) { return res.status(400).send({ status: false, message: "name is mandatory" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "phone no is mandatory" }) }
        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }

    //==============================validation by using Regex=============================================================// 

        if (!isValidName(title)) return res.status(400).send({ status: false, message: "plz provide title" })
        if (!["Miss", "Mrs", "Mr"].includes(title)) return res.status(400).send({ status: false, message: "title takes only Mr, Miss, Mrs" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Plz provied a valid name" })
        if (!forName(name)) return res.status(400).send({ status: false, message: "name should be valid and starts with Capital letter" })
        if (!isValidNumber(phone)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Choose a Strong Password,Use a mix of letters (uppercase and lowercase), numbers, and symbols in between 8-15 characters" })
       
        if(address){        
        let {street ,city,pincode } = address
        if (!isValidName(street)) return res.status(400).send({ status: false, message: "Plz provide street in address" })
        if (!isValidName(city)) return res.status(400).send({ status: false, message: "Plz provide city in address" })
        if (!isValidName(pincode)) return res.status(400).send({ status: false, message: "Plz provide pincode in address" })
        if (!pincodes(pincode)) return res.status(400).send({ status: false, message: "Plz provide a valid pincode" })
        }
    //==========================================================================================================================//


        let uniquePhn = await userModel.findOne({ phone: phone })   // checking Phone Number is Unique or not //
        if (uniquePhn) return res.status(400).send({ status: false, message: "phone no is already registered" })

        let uniqueEmail = await userModel.findOne({ email: email })  // checking Email is Unique or not //
        if (uniqueEmail) return res.status(400).send({ status: false, message: "email is already registered" })
        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: userData })     // Data is Create Successfully
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//=========================================<== SIGNIN API==>==============================================================//

const userLogin = async function (req, res) {
    try {
        let credentials = req.body
        let { email, password } = credentials       //=================Destructure data res.body

        if (Object.keys(credentials) == 0) {
            return res.status(400).send({ status: false, message: "email and password are required for Log in" })
        }
        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }

        if (email.length == 0 || password.length == 0) {
            return res.status(400).send({ status: false, message: "both fields are required." })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password is not valid" })
        }

        let userDetail = await userModel.findOne({ email: email, password: password })
        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found with this EmailId and Password" })
        }

        let token = jwt.sign({                                   //=======create Token by Jwt.sign Function
            id: userDetail._id.toString(),

        }, "project/booksManagementGroup22", { expiresIn: '30m' })
        res.setHeader("x-api-key", token)              // send Token in response Header

        return res.status(200).send({ status: true, message: "Success", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//==================================================================================//

module.exports.userLogin = userLogin
module.exports.createdUser = createdUser