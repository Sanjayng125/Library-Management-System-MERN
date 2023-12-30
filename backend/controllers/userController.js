import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../db/connectDB.js";
import e from "express";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//get all users
export const getAllUsersController = async (req, res) => {
  const query = "select * from signup where user_role = 'user'";

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length) {
        return res.status(200).send({
          message: "Got users",
          success: true,
          data,
        });
      } else {
        return res.status(201).send({
          message: "Not Available!",
          success: false,
        });
      }
    }
  });
};

//delete user
export const deleteUserController = async (req, res) => {
  const email = req.params.email;
  const query = "delete from signup where email = ?";

  db.query(query, [email], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        return res.status(200).send({
          message: "User Deleted!",
          status: true,
        });
      } else {
        return res.status(500).send({
          message: "Something went wrong!",
          status: false,
        });
      }
    }
  });
};

//get user details
export const getUserController = async (req, res) => {
  const name = req.params.name;
  const email = req.params.email;
  const query = "select * from signup where name = ? and email = ?";

  db.query(query, [name, email], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        return res.status(202).send(data[0]);
      }
    }
  });
};

//check if user exists
export const checkUserController = async (req, res) => {
  const email = await req.params.email;
  const query = "select * from signup where email = ? and user_role = 'user'";
  let users = [];

  db.query(query, [email], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        users = data;
        let userExists = false;
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            userExists = true;
          } else {
            userExists = false;
          }
        }
        return res.send(userExists);
      } else {
        return res.send(false);
      }
    }
  });
};

//update user
export const updateUserController = async (req, res) => {
  const email = req.params.email;
  const newName = req.body.name;
  const newEmail = req.body.email;
  const newPhone = req.body.phone;
  const query =
    "update signup set name = ?, email = ?, phone = ? where email = ?";

  db.query(query, [newName, newEmail, newPhone, email], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.affectedRows > 0) {
        return res.status(201).send({
          message: "Details Updated Successfully!",
          success: true,
        });
      } else {
        return res.status(201).send({
          message: "Something went wrong!",
          success: false,
        });
      }
    }
  });
};

export const searchUsersController = async (req, res) => {
  const keywords = req.params.keywords;

  db.query(
    `select * from signup where user_role = 'user' and name like '%${keywords}%' or email like '%${keywords}%'`,
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
