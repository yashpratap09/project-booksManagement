const userModel = require("../Models/userModel")
const { isValidName, isValidEmail, isValidNumber, isValidPassword,capitilize} = require("../validator/validator")
const jwt = require('jsonwebtoken')

//------------------------------------------------------------------- Post Api for User Creation ----------------------------------------------------



const createdUser = async function (req, res) {
    try {
        let  data = req.body
    const { title, name, phone, email, password, address } = data

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz provide data" })
        if (!title || title == "") return res.status(400).send({ status: false, msg: "plz provide title" })
        
        if (!["Miss", "Mrs", "Mr"].includes(title)) return res.status(400).send({ status: false, msg: "plz provide valid title" })
        if (!name) return res.status(400).send({ status: false, msg: "plz provide name" })
        if (!isValidName(name)) return res.status(400).send({ status: false, msg: "name is not valid" })
        if (!capitilize(name)) return res.status(400).send({ status: false, msg: "name is not in correct formate" })
        if (!phone) return res.status(400).send({ status: false, msg: "plz provide phone no" })
        if (!isValidNumber(phone)) return res.status(400).send({ status: false, msg: "phone is not valid" })
        if (!email) return res.status(400).send({ status: false, msg: "plz provide email" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
        if (!password) return res.status(400).send({ status: false, msg: "plz provide passward" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "passward is not valid" })
        if (!address) return res.status(400).send({ status: false, msg: "plz provide address" })
        let uniqueEmail= await userModel.findOne({email:email})
        if(uniqueEmail)  return res.status(400).send({status:false,message:"email is already exist"})
        
        let uniquePhn= await userModel.findOne({phone:phone})
        if(uniquePhn)  return res.status(400).send({status:false,message:"phone no is already exist"})

        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "user created succesfully", data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//------------------------------------------------------------------- Sign In ----------------------------------------------------


const userLogin= async function(req,res){
    try{
    let credentials=req.body
    let {email,password}=credentials
    if(Object.keys(credentials)==0){
       return res.status(400).send({status:false, message:"email and password are required"})}
    if(email.length==0|| password.length==0){
       return res.status(400).send({status:false, message:"both fields are required."})
    }

if(!isValidEmail(email)){
return res.status(400).send({status:false, message:"invalid email"})}


if(!isValidPassword(password)){
return res.status(400).send({status:false, message:"invalid password"})}


let userDetail=await userModel.findOne({$or:[{email:email,password:password}]})
if(!userDetail){
return res.status(404).send({status:false, message:"The email or password is wrong or this user is not present at that time."})}


const iat=Date.now()
const exp= Date.now()

let token=jwt.sign({
email:userDetail.email,
password:userDetail.password,
id:userDetail._id,
iat:iat,
exp:exp
},"project/booksManagementGroup22")

res.setHeader("x-api-key", token)
return res.status(200).send({status:true, message:"Success" ,data:token})}
catch(error){
return res.status(500).send({status:false, message: error.message})
}}


module.exports.userLogin= userLogin
module.exports.createdUser = createdUser