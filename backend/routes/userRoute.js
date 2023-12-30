import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  checkUserController,
  deleteUserController,
  getAllUsersController,
  getUserController,
  searchUsersController,
  updateUserController,
} from "../controllers/userController.js";

const router = express.Router();

//get all users
router.get("/get-all-users", requireSignIn, isAdmin, getAllUsersController);

//remove user
router.delete(
  "/remove-user/:email",
  requireSignIn,
  isAdmin,
  deleteUserController
);

//get user details by name
router.get("/get-user/:name/:email", requireSignIn, getUserController);

//check if user exists
router.get("/check-user/:email", requireSignIn, checkUserController);

//update user details
router.put("/update-user/:email", requireSignIn, updateUserController);

//search users
router.get(
  "/search-users/:keywords",
  requireSignIn,
  isAdmin,
  searchUsersController
);

export default router;
