const express = require('express');
const router = express.Router();
const userController=require("../Controller/userController")
const bookController=require("../Controller/bookController")
const reviewController = require("../Controller/reviewController")

router.post("/register",userController.createdUser)
router.post("/login",userController.userLogin)

router.post("/books", bookController.createBooks)




router.get("/books/:bookId", bookController.booksById)
router.get("/books", bookController.getBook)




router.post("/books/:bookId/review", reviewController.Reviewcreate);

module.exports = router;