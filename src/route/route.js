const express=require("express")
const router=express.Router()
const userController=require("../Controller/userController")

//------------------------------------------------------------------- Post Api ----------------------------------------------------


router.post("/register",userController.createdUser)
router.post('/login', userController.userLogin)



module.exports = router