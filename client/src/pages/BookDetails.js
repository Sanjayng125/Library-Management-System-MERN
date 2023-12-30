import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetails = () => {
  const [auth] = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState([]);
  const [sameCategoryBooks, setSameCategoryBooks] = useState([]);
  const [myIssueBooks, setMyIssueBooks] = useState([]);

  useEffect(() => {
    getSingleBook(params.name);
    getMyIssueBooks();
    // eslint-disable-next-line
  }, [params.name]);

  //requested books
  const getMyIssueBooks = async () => {
    if (auth?.name !== null) {
      try {
        await axios
          .get(`/api/v1/book/get-requested-books/${auth?.name}/${auth?.user}`)
          .then((res) => {
            setMyIssueBooks(res.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };

  //get single book by name
  const getSingleBook = async (bookname) => {
    try {
      await axios
        .get(`/api/v1/book/get-book/${bookname}`)
        .then((res) => {
          setBook(res.data);
          getSameCategoryBooks(res.data[0].selectedCategories);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const requestBook = async (bookname, image) => {
    if (auth?.name === null) {
      navigate("/login");
      return;
    }
    for (let i = 0; i < myIssueBooks.length; i++) {
      if (
        myIssueBooks[i].bookName === bookname &&
        myIssueBooks[i].status === "Requested"
      ) {
        toast.info("You have already requested this book wait for approvel!", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      if (
        myIssueBooks[i].bookName === bookname &&
        myIssueBooks[i].status === "Issued"
      ) {
        toast.info("You already have this book!", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }
    try {
      await axios
        .post(
          `/api/v1/book/request-book/${bookname}/${auth?.user}/${auth?.name}/${image}`
        )
        .then((res) => {
          if (res.data.success) {
            getMyIssueBooks();
            toast.success(res?.data?.message, {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            toast.error(res?.data?.message, {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const getSameCategoryBooks = async (category) => {
    try {
      await axios
        .get(`/api/v1/book/books-by-category/${category}`)
        .then((res) => {
          if (res?.data?.success) {
            setSameCategoryBooks(res.data.data);
          } else {
            document.getElementById("loading2").innerText = res?.data?.message;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ToastContainer />
        <div className="card" style={{ width: "90%" }}>
          <div className="row mx-auto" style={{ width: "100%" }}>
            {book.length > 0 ? (
              book.map((b, i) => {
                return (
                  <div
                    className="col-md-8 mb-5"
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        border: "1px black solid",
                        borderRadius: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={process.env.REACT_APP_IMAGE_PATH + b.image}
                        alt="book"
                        className="m-auto"
                        style={{
                          width: "230px",
                          height: "320px",
                          border: "1px black solid",
                          padding: "5px",
                          borderRadius: "4px",
                          objectFit: "fill",
                        }}
                      />
                    </div>
                    <div className="details" style={{ width: "100%" }}>
                      <h2 className="text-center mb-4">{b.name}</h2>
                      <h4>Price: Rs {b.price}/-</h4>
                      <h6>
                        Book Status:{" "}
                        {b.copies > 0 ? "Available" : "Not Available"}
                      </h6>
                      <h6>Desciption: {b.description}</h6>
                      <h6>Author: {b.author}</h6>
                      <h6>Published By: {b.published_by}</h6>
                      {auth?.user_role === "user" ||
                      auth?.user_role === null ? (
                        <>
                          <button
                            className="btn btn-warning m-1"
                            onClick={(e) => {
                              e.preventDefault();
                              requestBook(b.name, b.image);
                            }}
                          >
                            Request
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                      <button
                        className="btn btn-outline-secondary m-2"
                        onClick={() => navigate(`/`)}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <h6 id="loading1">Loading...</h6>
            )}
            {/* same category books */}
            <div className="col-md-3">
              <h3 className="text-center">Similar Books</h3>
              {sameCategoryBooks.length > 0 ? (
                // eslint-disable-next-line
                sameCategoryBooks?.map((scb, i) => {
                  if (scb.name !== params.name) {
                    return (
                      <div
                        className="card"
                        key={i}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={process.env.REACT_APP_IMAGE_PATH + scb?.image}
                          alt={scb?.name + "image"}
                          style={{
                            maxWidth: "80%",
                            aspectRatio: "7/9",
                            border: "1px black solid",
                            padding: "5px",
                            borderRadius: "4px",
                            margin: "5px",
                          }}
                        />
                        <div style={{ width: "100%" }}>
                          <h5 className="text-center">{scb.name}</h5>
                          <p>
                            <strong>Price: Rs {scb.price}/-</strong>
                          </p>
                        </div>
                        <div>
                          <button className="btn btn-warning m-2">
                            Request
                          </button>
                          <button
                            className="btn btn-outline-secondary m-2"
                            onClick={(e) => {
                              e.preventDefault();
                              //pending
                              navigate(`/book-details/${scb.name}`);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <p id="loading2">Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
