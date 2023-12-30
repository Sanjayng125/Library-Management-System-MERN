import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  removeCategoriesController,
  searchCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//Routes

//create new category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//get all categories
router.get("/get-categories", getCategoriesController);

//get single category
router.post("/get-category", getCategoryController);

//remove category
router.delete(
  "/remove-categories/:name",
  requireSignIn,
  isAdmin,
  removeCategoriesController
);

//search category
router.get(
  "/search-category/:keywords",
  requireSignIn,
  isAdmin,
  searchCategoryController
);

export default router;
