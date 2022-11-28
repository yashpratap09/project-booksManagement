const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel")
const {isValidName,isValidObjectId,
}=require("../validator/validator")
const moment = require("moment")


const Reviewcreate = async function (req, res) {
    try {
        let data = req.body;
        let id = req.params.bookId;
        const { rating,bookId } = data

        if (!isValidObjectId(id)) { return res.status(400).send({ status: false, message: 'provide a valid id' }) }

        if (id != bookId) { return res.status(400).send({ status: false, message: 'provide valid book Id' }) }

        let books = await bookModel.findById(id);
        if (!books) { return res.status(404).send({ status: false, message: 'Data dont exit in your Database / provied valid Id' }) }

        let is_Deleted = books.isDeleted;
        if (is_Deleted == true) { return res.status(404).send({ status: false, message: 'Book is deleted/Data dont exit in your Database' }) }

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'plz provied data' }) }

        if (!isValidName(bookId)) { return res.status(400).send({ status: false, message: 'required book Id' }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'Please provide a valid Id' }) }

        let Books = await bookModel.findById(bookId);
        if (!Books) { return res.status(400).send({ status: false, message: 'Data dont exit in your Database, please provide a valid Id' }) }

       // if (!isValidName(rating)) { return res.status(400).send({ status: false, message: "Rating is required" }) }

        if (rating < 1 || rating > 5) { return res.status(400).send({ status: false, message: "Rating lenth B/W  min 1 to max 5" }) }
       

        let date = moment().format("YYYY-MM-DD")
        data.reviewedAt = date;

        const updatedBook = await bookModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: +1 } }, { new: true })

        const reviews = await reviewModel.create(data);


        return res.status(201).send({ status: true,  data: { ...updatedBook.toObject(), reviewsData: reviews } })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.Reviewcreate = Reviewcreate;