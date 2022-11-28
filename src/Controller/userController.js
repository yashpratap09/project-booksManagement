const userModel = require("../Models/userModel")
const {isValidName,isValidEmail,isValidNumber,isValidPassward,
}=require("../validator/validator")

const createdUser = async function (req, res) {
    try {
        let data = req.body     
    const{ title, name, phone, email, passward, address } = data

        if (Object.keys(data).length ===0) return res.status(400).send({ status: false, msg: "plz provide data" })
        if (!title || title=="") return res.status(400).send({ status: false, msg: "plz provide title" })
        if (!name) return res.status(400).send({ status: false, msg: "plz provide name" })
        if (!phone) return res.status(400).send({ status: false, msg: "plz provide phone no" })
        if (!email) return res.status(400).send({ status: false, msg: "plz provide email" })
        if (!passward) return res.status(400).send({ status: false, msg: "plz provide passward" })
        if (!address) return res.status(400).send({ status: false, msg: "plz provide address" })

let titles=["Mr"," Mrs"," Miss"]
if (!titles.includes(title)) return res.status(400).send({status:false,msg:"plz provide title"})
if (!isValidName.test(name) && !capitilize(name)) return res.status(400).send({status:false,msg:"name is not valid"})
if (!isValidNumber.test(phone)) return res.status(400).send({status:false,msg:"phone is not valid"})
if(!isValidEmail.test(email)) return res.status(400).send({status:false,msg:"email is not valid"})
if(!isValidPassward.test(passward)) return res.status(400).send({status:false,msg:"passward is not valid"})

        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "user created succesfully", data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createdUser=createdUser