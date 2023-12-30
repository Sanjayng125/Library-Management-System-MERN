import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import db from "../db/connectDB.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

db.connect((err) => {
  if (err) console.log(err);
  else console.log("DB Connected");
});

//new user
export const registerController = async (req, res) => {
  //check user exists pending

  const email = req.body.email;
  const checkQuery = "select * from signup where email = ?";

  db.query(checkQuery, [email], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length) {
        return res.status(201).send({
          message: "Email Already Taken!",
        });
      } else {
        const query = "insert into signup values (?)";
        const values = [
          req.body.name,
          req.body.email,
          req.body.password,
          req.body.phone,
          "user",
        ];

        db.query(query, [values], (err, data) => {
          if (err) {
            console.log(err);
          } else {
            if (data.affectedRows > 0) {
              return res.status(200).send({
                message: "Account Created Successfully!",
                success: true,
              });
            } else {
              return res.status(200).send({
                message: "Something went wrong!",
                success: false,
              });
            }
          }
        });
      }
    }
  });
};

//login controller
export const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = "select * from signup where email = ? and password = ?";

  db.query(query, [email, password], async (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      const token = await JWT.sign(
        { _id: data[0].email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      return res.json({
        msg: "Logged In Successfully!",
        success: true,
        email: data[0].email,
        user_role: data[0].user_role,
        name: data[0].name,
        phone: data[0].phone,
        token,
      });
    } else {
      return res.json({
        msg: "Something went wrong!",
        success: false,
      });
    }
  });
};
