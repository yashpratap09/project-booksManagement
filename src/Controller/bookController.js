const userModel = require("../Models/userModel")
const bookModel = require("../Models/bookModel")
const reviewModel = require("../Models/reviewModel")

const { isValidName, isValidObjectId, validatorISBN
} = require("../validator/validator")
const moment = require("moment")



const createBooks = async function (req, res) {
  try {
    const data = req.body;




    if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'Bad request' }) }



    if (!isValidName(data.title)) { return res.status(400).send({ status: false, message: 'Title is required' }) }

    let isUniquetitle = await bookModel.findOne({ title: data.title })
    if (isUniquetitle) { return res.status(400).send({ status: false, message: 'Title already exist' }) }

    if (!isValidName(data.excerpt)) { return res.status(400).send({ status: false, message: 'Excerpt is required' }) }

    if (!isValidName(data.userId)) { return res.status(400).send({ status: false, message: 'User Id is required' }) }

    if (!isValidObjectId(data.userId)) { return res.status(400).send({ status: false, message: 'Please provide a valid userId' }) }

    let isValidid = await userModel.findOne({ _id: data.userId })
    if (!isValidid) { return res.status(400).send({ status: false, message: 'Data dont exit in your Database, Please provide a valid User Id' }) }

    if (!isValidName(data.ISBN)) { return res.status(400).send({ status: false, message: 'ISBN is required' }) }

    if (!validatorISBN(data.ISBN)) { return res.status(400).send({ status: false, message: 'Please provide a valid ISBN' }) }

    let isUniqueISBN = await bookModel.findOne({ ISBN: data.ISBN })
    if (isUniqueISBN) { return res.status(400).send({ status: false, message: 'ISBN already exist' }) }

    if (!isValidName(data.category)) { return res.status(400).send({ status: false, message: 'Category is required' }) }

    if (!isValidName(data.releasedAt)) { return res.status(400).send({ status: false, message: 'Released date is required' }) }




    if (!isValidName(data.subcategory)) { return res.status(400).send({ status: false, message: 'Subcategory is required' }) }

    let date = moment().format("YYYY-MM-DD")


    const createBook = await bookModel.create(data);

    return res.status(201).send({ status: true, data: createBook, releasedAt: date })

  }
  catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
  }
}



//===================================================================================================================//

const getBook = async function (req, res) {
  try {
    const queryParams = req.query;
    const userid = req.query.userId
    if (userid) {
      const ObjectId = require("mongodb").ObjectId;
      const validId = ObjectId.isValid(userid);
      if (!validId) { return res.status(404).send({ status: false, msg: "Invalid userId " }); }
    }

    const book = await bookModel.find({ isDeleted: false, ...queryParams, }).select({
      _id: 1, title: 1, excerpt: 1, userId: 1, category: 1,
      releasedAt: 1, reviews: 1
    }).sort({ title: 1 });


    if (book.length == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Document doesnt exist" });
    }

    if (book) {
      return res.status(200).send({ status: true, count: book.length, msg: book });
    }
  } catch (err) {

    console.log("It seems an error", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};



//==================================================================================================================//

const booksById = async function (req, res) {
  try {
    const bookId = req.params.bookId
    if (Object.keys(bookId) == 0) {
      return res.status(400).send({ status: false, message: "Invalid Id" })
    }

    if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'provide a valid Id' }) }
    const getdata = await bookModel.find({ _id: bookId, isDeleted: false }).select({ ISBN: 0 })
    if (getdata.length == 0) {
      return res.status(404).send({ status: false, message: "Data dont exit in your Database in this Id" })
    }
    const review = await reviewModel.find({ bookId: bookId, isDeleted: false })
      .select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

    const Data = {
      _id: getdata[0]._id,
      title: getdata[0].title,
      excerpt: getdata[0].excerpt,
      userId: getdata[0].userId,
      category: getdata[0].category,
      subcategory: getdata[0].subcategory,
      reviews: getdata[0].reviews,
      isDeleted: getdata[0].isDeleted,
      deletedAt: getdata[0].deletedAt,
      releasedAt: getdata[0].releasedAt,
      reviewsData: review
    }

    return res.status(200).send({ status: true, data: Data })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


//=======================================================================================================//


const deletById = async function (req, res) {
  try {
    const bookId = req.params.bookId
    if (Object.keys(bookId) == 0) {
      return res.status(400).send({ status: false, message: "Invalid Id" })
    }

    if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'provide a valid Id' }) }

    const getdata = await bookModel.find({ _id: bookId, isDeleted: false }).select({ ISBN: 0 })
    if (getdata.length == 0) {
      return res.status(404).send({ status: false, message: "Data dont exit in your Database in this Id" })
    }
    const deletData = await bookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })


    return res.status(200).send({ status: true, msg: "Data Successfully deleted", data: deletData })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}



//=============================================================================================================//
const updateById = async function (req, res) {
  try {
    const bookId = req.params.bookId
    if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'Please provide a valid bookId' }) }

    if (Object.keys(bookId) == 0) {
      return res.status(400).send({ status: false, message: "Invalid Id" })
    }


    const data = req.body
    let { title, ISBN } = data
    if (ISBN) {
      if (!validatorISBN(ISBN)) { return res.status(400).send({ status: false, message: 'Please provide a valid ISBN' }) }
    }

    const duplicate = await bookModel.find({ ISBN: ISBN })

    if (duplicate.length !== 0) {
      return res.status(404).send({ status: false, message: "ISBN is alredy exit in Database" })
    }

    const duplicateTitle = await bookModel.find({ title: title })

    if (duplicateTitle.length !== 0) {
      return res.status(404).send({ status: false, message: "Title is alredy exit in Database" })
    }




    const validobjectId = await bookModel.findById({ _id: bookId })
    if (!validobjectId) { return res.status(404).send({ status: false, message: "Data dont exit in your Database in this Id" }) }

    const updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { ...data } }, { new: true })



    return res.status(200).send({ status: true, msg: "Data Successfully updated", data: updateData })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}






module.exports.createBooks = createBooks
module.exports.booksById = booksById
module.exports.getBook = getBook
module.exports.deletById = deletById
module.exports.updateById = updateById


