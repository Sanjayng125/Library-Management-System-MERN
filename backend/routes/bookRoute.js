import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addBookController,
  approveRequestController,
  booksByCategoryController,
  cancelRequestController,
  deleteRejectedRequestController,
  getAllBooksController,
  getAllRequestsController,
  getHistoryController,
  getIssuedBooksController,
  getSingleBooksController,
  getUserRequestedBooksController,
  rejectRequestController,
  removeBookController,
  requestBookController,
  returnBookController,
  searchBooksController,
  searchHistoryController,
  searchIssuedBooksController,
  searchUserBooksController,
  updateBookController,
} from "../controllers/bookController.js";
import multer from "multer";

const router = express.Router();

//Routes

//create new book
//image storage config
var imgConfig = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `image${Date.now()}.${file.originalname}`);
  },
});

//img filter
const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, Error("Only image is allowed!"));
  }
};

var upload = multer({
  storage: imgConfig,
  filFilter: isImage,
});

router.post(
  "/add-book",
  upload.single("photo"),
  requireSignIn,
  isAdmin,
  addBookController
);

//get all books
router.get("/get-books", getAllBooksController);

//get single book
router.get("/get-book/:name", getSingleBooksController);

//update book
router.post("/update-book/:name", requireSignIn, isAdmin, updateBookController);

//remove book
router.delete(
  "/remove-books/:name/:image",
  requireSignIn,
  isAdmin,
  removeBookController
);

//request book
router.post(
  "/request-book/:bookname/:email/:username/:image",
  requireSignIn,
  requestBookController
);

//get requested books by username and email
router.get(
  "/get-requested-books/:username/:email",
  requireSignIn,
  getUserRequestedBooksController
);

//get all requests
router.get(
  "/get-all-requests",
  requireSignIn,
  isAdmin,
  getAllRequestsController
);

//cancel issue request
router.delete(
  "/cancel-request/:bookname/:username/:email",
  requireSignIn,
  cancelRequestController
);

//reject book request
router.put(
  "/reject-request/:bookname/:username/:email",
  requireSignIn,
  isAdmin,
  rejectRequestController
);

//approve book request
router.put(
  "/approve-request/:bookname/:username/:email",
  requireSignIn,
  isAdmin,
  approveRequestController
);

//return book
router.put(
  "/return-book/:bookname/:username/:email",
  requireSignIn,
  returnBookController
);

//delete rejected requests
router.delete(
  "/delete-rejected/:bookname/:username/:email/:requestedon",
  requireSignIn,
  deleteRejectedRequestController
);

//get returned and rejected books history for admin
router.get("/get-history", requireSignIn, isAdmin, getHistoryController);

//get issued books for admin
router.get(
  "/get-issuedBooks",
  requireSignIn,
  isAdmin,
  getIssuedBooksController
);

//search

//search books
router.get("/search-books/:name", searchBooksController);

//search history by book name, user name or email
router.get(
  "/search-history/:keywords",
  requireSignIn,
  isAdmin,
  searchHistoryController
);

//search issued books by book name, user name or email
router.get(
  "/search-issued/:keywords",
  requireSignIn,
  isAdmin,
  searchIssuedBooksController
);

//search books by book name, user name and email
router.get(
  "/search-user-books/:bookname/:username/:email",
  requireSignIn,
  searchUserBooksController
);

//search books by category
router.get("/books-by-category/:category", booksByCategoryController);

export default router;
