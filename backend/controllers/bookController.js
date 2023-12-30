import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../db/connectDB.js";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

export const addBookController = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const author = req.body.author;
  const price = req.body.price;
  const copies = req.body.copies;
  const addedby = req.body.addedby;
  const selectedCategories = req.body.selectedCategories;
  const image = req.file.filename;

  const query = "insert into book values (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    db.query(
      query,
      [
        name,
        description,
        author,
        addedby,
        price,
        copies,
        selectedCategories,
        image,
      ],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            return res.status(200).send({
              message: "Book Added Successfully!",
              success: true,
            });
          } else {
            return res.status(200).send({
              message: "Somthing went wrong!",
              success: false,
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllBooksController = async (req, res) => {
  const query = "select * from book";

  try {
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length > 0) {
          return res.send({
            success: true,
            data,
          });
        } else {
          return res.send({
            success: false,
            message: "Not Availble!",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get single book
export const getSingleBooksController = async (req, res) => {
  const name = req.params.name;
  const query = "select * from book where name = ?";

  try {
    db.query(query, [name], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data) {
          return res.send(data);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//update book
export const updateBookController = async (req, res) => {
  const bookname = req.params.name;
  const name = req.body.name;
  const description = req.body.description;
  const author = req.body.author;
  const price = req.body.price;
  const copies = req.body.copies;
  const addedby = req.body.addedby;
  const selectedCategories = req.body.selectedCategories;

  const query =
    "update book set name = ?, description = ?, author = ?, price = ?, copies = ?, published_by = ?, selectedCategories = ? where name = ?";

  try {
    db.query(
      query,
      [
        name,
        description,
        author,
        price,
        copies,
        addedby,
        selectedCategories,
        bookname,
      ],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.affectedRows > 0) {
            return res.status(201).send({
              message: "Book Details Updated Successfully!",
              success: true,
            });
          } else {
            return res.status(201).send({
              message: "Something went wrong!",
              success: false,
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Remove book
export const removeBookController = (req, res) => {
  try {
    const name = req.params.name;
    const image = req.params.image;
    fs.unlink(`./public/images/${image}`, (err) => {
      if (err) console.log(err);
    });
    const query = "delete from book where name = ?";

    db.query(query, [name], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          return res.status(200).send({
            message: "Book Deleted!",
            success: true,
          });
        } else {
          return res.status(200).send({
            message: "Somthing went wrong!",
            success: false,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//request book
export const requestBookController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const status = "Requested";
  const requestedOn = new Date();
  const image = req.params.image;

  const query = "insert into issueBook values (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    db.query(
      query,
      [bookName, userName, email, status, requestedOn, "", "", image],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.affectedRows > 0) {
            return res.status(201).send({
              message: "Book Requested!",
              success: true,
            });
          } else {
            return res.status(201).send({
              message: "Something went wrong!",
              success: false,
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//get requested books of user
export const getUserRequestedBooksController = async (req, res) => {
  const userName = req.params.username;
  const email = req.params.email;
  const query = "select * from issueBook where userName = ? and email = ?";

  try {
    db.query(query, [userName, email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data) {
          return res.send(data);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get all request
export const getAllRequestsController = async (req, res) => {
  const query = "select * from issueBook where status = 'Requested'";

  try {
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length) {
          return res.send({
            success: true,
            data,
          });
        } else {
          return res.send({
            success: false,
            message: "Not Available!",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//cancel issue request
export const cancelRequestController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const query =
    "delete from issueBook where bookName = ? and userName = ? and email = ? and status = 'Requested'";

  try {
    db.query(query, [bookName, userName, email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          return res.status(201).send({
            message: "Request Cancelled!",
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
  } catch (error) {
    console.log(error);
  }
};

//reject book request
export const rejectRequestController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const query =
    "update issueBook set status = 'Rejected', approvedOn = 'Request Rejected!', returnedOn = 'Request Rejected!' where bookName = ? and userName = ? and email = ? and status = 'Requested'";

  try {
    db.query(query, [bookName, userName, email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          return res.status(201).send({
            message: "Request Rejected!",
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
  } catch (error) {
    console.log(error);
  }
};

//approve book request
export const approveRequestController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const approvedOn = new Date();
  const query =
    "update issueBook set status = 'Issued', approvedOn = ?, returnedOn = 'Not Returned' where bookName = ? and userName = ? and email = ? and status = 'Requested'";
  const query2 = "update book set copies = copies - 1 where name = ?";

  try {
    db.query(query, [approvedOn, bookName, userName, email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          db.query(query2, [bookName], (err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (data.affectedRows > 0) {
                return res.status(201).send({
                  message: "Book Issued!",
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
        } else {
          return res.status(201).send({
            message: "Something went wrong issueing book!",
            success: false,
          });
        }
      }
    });
  } catch (error) {
    console.log();
  }
};

//return book
export const returnBookController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const returnedOn = new Date();
  const query =
    "update issueBook set status = 'Returned', returnedOn = ? where bookName = ? and userName = ? and email = ? and status = 'Issued'";
  const query2 = "update book set copies = copies + 1 where name = ?";

  try {
    db.query(query, [returnedOn, bookName, userName, email], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          db.query(query2, [bookName], (err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (data.affectedRows > 0) {
                return res.status(201).send({
                  message: "Book Returned!",
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
        } else {
          return res.status(201).send({
            message: "Something went wrong returning book!",
            success: false,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//delete rejected requests
export const deleteRejectedRequestController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;
  const requestedOn = req.params.requestedon;
  const query =
    "delete from issueBook where bookName = ? and userName = ? and email = ? and status = 'Rejected' and requestedOn = ?";

  try {
    db.query(query, [bookName, userName, email, requestedOn], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.affectedRows > 0) {
          return res.status(201).send({
            message: "Rejected Request Deleted!",
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
  } catch (error) {
    console.log(error);
  }
};

//get returned and rejected books history
export const getHistoryController = async (req, res) => {
  const query =
    "select * from issueBook where status = 'Returned' or status = 'Rejected'";

  try {
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length) {
          return res.send({
            success: true,
            data,
          });
        } else {
          return res.send({
            success: false,
            message: "Not Available!",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get issued books
export const getIssuedBooksController = async (req, res) => {
  const query = "select * from issueBook where status = 'Issued'";

  try {
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length) {
          return res.send({
            success: true,
            data,
          });
        } else {
          return res.send({
            success: false,
            message: "Not Available!",
          });
        }
      }
    });
  } catch (error) {
    console.log();
  }
};

//SEARCH------------------------------------------------------------------------------------------------

//get search books
export const searchBooksController = async (req, res) => {
  const searchQuery = req.params.name;

  if (searchQuery !== "") {
    try {
      db.query(
        `select * from book where name like '%${searchQuery}%' or description like '%${searchQuery}%' or selectedCategories like '%${searchQuery}%'`,
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            if (data.length) {
              return res.send({
                success: true,
                data,
              });
            } else {
              return res.send({
                success: false,
                message: "No Results Available!",
              });
            }
          }
        }
      );
    } catch (error) {
      console.log();
    }
  }
};

//search history by book name, user name or email
export const searchHistoryController = async (req, res) => {
  const searchQuery = req.params.keywords;

  if (searchQuery !== "") {
    try {
      db.query(
        `select * from issueBook where (email like '%${searchQuery}%' or userName like '%${searchQuery}%' or bookName like '%${searchQuery}%') and status like '%Returned%' or status like '%Rejected%'`,
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
    } catch (error) {
      console.log(error);
    }
  }
};

//search issued books by book name, user name or email
export const searchIssuedBooksController = async (req, res) => {
  const searchQuery = req.params.keywords;

  if (searchQuery !== "") {
    try {
      db.query(
        `select * from issueBook where (email like '%${searchQuery}%' or userName like '%${searchQuery}%' or bookName like '%${searchQuery}%') and status = 'Issued'`,
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
    } catch (error) {
      console.log(error);
    }
  }
};

//search user books by book name, user name and email
export const searchUserBooksController = async (req, res) => {
  const bookName = req.params.bookname;
  const userName = req.params.username;
  const email = req.params.email;

  try {
    db.query(
      `select * from issueBook where bookName like '%${bookName}%' and userName = '${userName}' and email = '${email}'`,
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
  } catch (error) {
    console.log(error);
  }
};

export const booksByCategoryController = async (req, res) => {
  const category = req.params.category;
  const query = `select * from book where selectedCategories like '%${category}%'`;

  try {
    db.query(query, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length > 0) {
          return res.send({
            success: true,
            data: data,
          });
        } else {
          return res.send({
            success: false,
            message: "Not Available!",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
