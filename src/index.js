const express=require("express")
const mongoose=require("mongoose")
const route=require("./route/route")

const app=express()
app.use(express.json())

mongoose.connect("mongodb+srv://yashsingh:8i1kfhU26wUDrXft@cluster0.e53dru9.mongodb.net/group22Database"),{useNewUrlParser:true}
.then(()=> console.log("MongoDB is connected"))
.catch((error)=>console.log(error))

app.listen(process.env.PORT||3000,function(){
    console.log("port is connected to 3000")
})

app.use("/",route)