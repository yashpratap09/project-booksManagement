const express = require('express');
const router = express.Router();
const userController=require("../Controller/userController")
const bookController=require("../Controller/bookController")
const reviewController = require("../Controller/reviewController")
const auth = require("../middleware/auth")



//============================ user Api ===============================================//

router.post("/register",userController.createdUser)                                                    // Mamta
router.post("/login",userController.userLogin)                                                        // by Vanshika


//==============================  books API ===========================================//

router.post("/books" ,auth.authenticate,auth.authorisation, bookController.createBooks)               // mamta 

router.get("/books",auth.authenticate, bookController.getBook)                                       // mamta

router.get("/books/:bookId",auth.authenticate, bookController.booksById)                             // Yash 

router.delete("/books/:bookId",auth.authenticate,auth.authorisation, bookController.deletById)       // newton

router.put("/books/:bookId",auth.authenticate,auth.authorisation, bookController.updateById)         // by Vanshika 


//==============================reviews API===========================================//

router.post("/books/:bookId/review", reviewController.Reviewcreate);                                  // vanshika

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);                         // Yash

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);                      // newton

//===============================router validation(For path is valid or Not)===================================================//


router.all("/*", async function (req, res) {
    return res.status(400).send({ status: false, message: "Bad reqeust / invalid Path" });
  });


module.exports = router;


                                                                                                       // authenticate   // newton

                                                                                                        // authorisation  // Yash