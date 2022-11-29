const express = require('express');
const router = express.Router();
const userController=require("../Controller/userController")
const bookController=require("../Controller/bookController")
const reviewController = require("../Controller/reviewController")


const auth = require("../middleware/auth")


router.post("/register",userController.createdUser)
router.post("/login",userController.userLogin)

router.post("/books" ,auth.authenticate,auth.authorisation, bookController.createBooks)




router.get("/books/:bookId",auth.authenticate, bookController.booksById)

router.get("/books",auth.authenticate, bookController.getBook)

router.delete("/books/:bookId",auth.authenticate,auth.authorisation, bookController.deletById)

router.put("/books/:bookId",auth.authenticate,auth.authorisation, bookController.updateById)




router.post("/books/:bookId/review", reviewController.Reviewcreate);



router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

module.exports = router;