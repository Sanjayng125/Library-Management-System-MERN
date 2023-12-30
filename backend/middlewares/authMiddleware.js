import JWT from "jsonwebtoken";
import db from "../db/connectDB.js";

//Protected Routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//Admin access
export const isAdmin = async (req, res, next) => {
  const mail = req.user._id;
  try {
    const query = "select * from signup where email = ?";
    db.query(query, [mail], async (err, data) => {
      if (err) return res.json(err);
      if (data) {
        // console.log(data[0].user_role);
        const user = await data[0].user_role;
        if (user !== "admin") {
          return res.status(401).send({
            success: false,
            message: "Unautorized Access",
          });
        } else {
          next();
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};
