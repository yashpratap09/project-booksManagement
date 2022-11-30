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

router.delete("/books/:bookId", bookController.deletById)

router.put("/books/:bookId",auth.authenticate,auth.authorisation, bookController.updateById)




router.post("/books/:bookId/review", reviewController.Reviewcreate);

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);  


router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);    //auth.authenticate,auth.authorisation   // 





router.all("/*", async function (req, res) {
    return res.status(400).send({ status: false, message: "Bad reqeust/invalid Path" });
  });


module.exports = router;
