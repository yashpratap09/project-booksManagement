const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel")
const { isValidObjectId, isValidName,
} = require("../validator/validator")
const moment = require("moment")

//=========================================<== CREATER RREVIEW API==>==============================================================//
const Reviewcreate = async function (req, res) {
    try {
        let data = req.body;
        let id = req.params.bookId;
        const { rating } = data

        if (!isValidObjectId(id)) { return res.status(400).send({ status: false, message: 'provide a valid id' }) }



        let books = await bookModel.findById(id);
        if (!books) { return res.status(404).send({ status: false, message: 'Data dont exit in your Database / provied valid Id' }) }

        let is_Deleted = books.isDeleted;
        if (is_Deleted == true) { return res.status(404).send({ status: false, message: 'Book is deleted/Data dont exit in your Database' }) }

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'plz provied data' }) }



        if (!isValidObjectId(id)) { return res.status(400).send({ status: false, message: 'Please provide a valid Id' }) }

        let Books = await bookModel.findById(id);
        if (!Books) { return res.status(400).send({ status: false, message: 'Data dont exit in your Database, please provide a valid Id' }) }



        if (rating < 1 || rating > 5) { return res.status(400).send({ status: false, message: "Rating lenth B/W  min 1 to max 5" }) }


        let date = moment().format("YYYY-MM-DD")                //date by using Moment
        data.reviewedAt = date;
        data.bookId = id

        const updatedBook = await bookModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: +1 } }, { new: true })  // update reviews 

        const reviews = await reviewModel.create(data);


        return res.status(201).send({ status: true, data: { ...updatedBook.toObject(), reviewsData: reviews } })        //using toObject() Function in adding new key value pair in Response

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//======================================<== updateReview RREVIEW API==>============================================================//

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let data = req.body
        if (!isValidName(bookId)) {
            return res.status(404).send({ messege: "Please provide  bookId" })
        }
        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: 'plz prrovied valid bookId' });
            return;
        }
        if (!isValidName(reviewId)) {
            return res.status(404).send({ message: "Please provide reviewId " })
        }
        if (!isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: 'plz prrovied valid reviewId' });
            return;
        }
        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) {
            return res.status(404).send({ message: "No Book Available in this Id" })
        }
        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findReview) {
            return res.status(404).send({ status: false, message: "No Review Available in this Id" })
        }
        if (findBook && findReview) {

            if (Object.keys(data).length == 0) {
                return res.status(400).send({ message: " plz provied data" })
            }

            const { reviewedBy, review, rating } = data
            if (reviewedBy) {
                if (!isValidName(reviewedBy)) {
                    return res.status(404).send({ message: "plz provied  reviewer's name" })
                }
            }
            if (review) {
                if (!isValidName(review)) {
                    return res.status(404).send({ message: "plz provied  Your Review" })
                }
            }
            if (rating) {
                if (!isValidName(rating)) {
                    return res.status(404).send({ message: "plz write Rating" })
                }
                if (rating < 1 || rating > 5) {
                    return res.status(400).send({ status: false, message: "Rating Value Between 1 to 5" })
                }
            }

            const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { ...data }, { new: true }).select({ __v: 0 })
            return res.status(200).send({ status: true, message: 'Review updated', data: updatedReview });


        } else {
            return res.status(400).send({ status: false, message: "can not find book to review " })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



///=========================================<== DELETE RREVIEW API==>==============================================================//
const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (Object.keys(bookId) == 0) { return res.status(400).send({ status: false, mes: "provide book Id" }) }

        if (Object.keys(reviewId) == 0) { return res.status(400).send({ status: false, mes: "provide review Id" }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, mes: ' provide a valid Book id' }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, mes: ' provide a valid Review id' }) }

        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) { return res.status(404).send({ status: false, message: "No Book Is Present with this id our database" }) }
        if (findBook.isDeleted == true) { return res.status(400).send({ status: false, message: "Book has already been deleted" }) }
        const findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findReview) { return res.status(404).send({ status: false, message: "No Review Is Present with this id our database" }) }

        if (findReview.isDeleted == true) { return res.status(400).send({ status: false, message: "Review has already been deleted" }) }

        let date = moment().format("YYYY-MM-DD")         //date by using Moment

        const deleteReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt:date }, { new: true })

        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Review deleted successfully." })



    }
    catch (error) {
        console.log(err)
        res.status(500).send({ status: false, message: error.message })
    }
}

//========================================================================================================//


module.exports.Reviewcreate = Reviewcreate;
module.exports.deleteReview = deleteReview;
module.exports.updateReview = updateReview;