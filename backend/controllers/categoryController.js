import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../db/connectDB.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//new category
export const createCategoryController = async (req, res) => {
  const query = "insert into category values (?)";
  const name = req.body.name;

  db.query(query, [name], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      if (data) {
        res.status(200).send({
          message: "Category Added",
          success: true,
        });
      }
    }
  });
};

//get all categories
export const getCategoriesController = async (req, res) => {
  const query = "select * from category";

  db.query(query, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      if (data) {
        res.status(200).send({
          success: true,
          data: data,
        });
      }
    }
  });
};

//get category by category name
export const getCategoryController = async (req, res) => {
  const name = req.body.name;
  const query = "select * from category where name = ?";

  db.query(query, [name], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      if (data) {
        res.status(200).send({
          success: true,
          data: data,
        });
      }
    }
  });
};

//remove categories
export const removeCategoriesController = async (req, res) => {
  const name = await req.params.name;
  const query = "delete from category where name = ?";

  db.query(query, [name], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      if (data) {
        res.status(200).send({
          message: "Category Deleted Successfully!",
          success: true,
        });
      }
    }
  });
};

export const searchCategoryController = async (req, res) => {
  const keywords = req.params.keywords;

  db.query(
    `select * from category where name like '%${keywords}%'`,
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data) {
          return res.send(data);
        } else {
          return res.json("Not Found!");
        }
      }
    }
  );
};
