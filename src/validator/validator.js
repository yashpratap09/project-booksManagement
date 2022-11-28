
const isValidName = function(value){ 
let nameRegex=/^([a-zA-Z_]+\s)*[a-zA-Z_]{2,50}$/
if(value ==="" && value===null && value==="undefined") return false
if(nameRegex.test(value)) return true
}

const capitilize=function(value){
    return value.toLowerCase().split("").map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join("")
}
const isValidEmail = function(value){
    let emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,3}))$/
if (emailRegex.test(value)) return true
}

const isValidNumber = function(value){
    let phnNum=/^[0]?[6789]\d{9}$/
    if((value ==="" && value===null && value==="undefined"))return false
    if(phnNum.test(value)) return true
}

const isValidPassward = function(value){
   let passward= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/
if(passward.test(value)) return true

}



module.exports={isValidName,isValidEmail,isValidNumber,isValidPassward,capitilize}