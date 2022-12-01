
//=============================Vlidator for Vlue(undefined,null and after trim lenth is zero)============================//

const isValidName = function (value) {
  if (typeof value === undefined || typeof value === null) {
    return false;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return true;
  }
}


//===========================Vlidation for Name by using Regex=========================//

const forName = function (value) {
  return /^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,}$/.test(value);
};


//===========================Vlidation for Email by using Regex=========================//


const isValidEmail = function (value) {
  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,3}))$/
  if (emailRegex.test(value)) return true
}

//===========================Vlidation for Phone Number by using Regex=========================//

const isValidNumber = function (value) {
  let phnNum = /^[0]?[6789]\d{9}$/
  if ((value === "" && value === null && value === "undefined")) return false
  if (phnNum.test(value)) return true
}

//===========================Vlidation for Passward by using Regex=========================//

const isValidPassward = function (value) {
  let passward = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/
  if (passward.test(value)) return true

}

//===========================Vlidation for mongoose/mongoDb Oject Id by using Regex=========================//

const isValidObjectId = function (objectId) {
  return /^[0-9a-fA-F]{24}$/.test(objectId)
}

//===========================Vlidation for ISBN Number by using Regex=========================//

const validatorISBN = function (ISBN) {
  return /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN);
}

 

//===================================Export All validotor=================================//

module.exports = { isValidName, isValidEmail, isValidNumber, isValidPassward, isValidObjectId, validatorISBN, forName }