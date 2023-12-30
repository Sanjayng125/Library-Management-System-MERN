import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/home.css";

const Home = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [myIssueBooks, setMyIssueBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  // eslint-disable-next-line
  const [filetredBooks, setFilterBooks] = useState([]);
  const [showBooks, setShowBooks] = useState([]);

  //get all books
  const getAllBooks = async () => {
    try {
      axios
        .get("/api/v1/book/get-books")
        .then((res) => {
          if (res?.data?.success) {
            setBooks(res?.data.data);
            setShowBooks(res?.data.data);
          } else {
            document.getElementById("loading").innerText = res?.data?.message;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //get all categories
  const getAllCategories = async () => {
    try {
      axios
        .get("/api/v1/category/get-categories")
        .then((res) => {
          setCategories(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  const resetCategories = () => {
    for (let i = 0; i < categories.length; i++) {
      document.getElementById(categories[i].name).checked = false;
    }
    setSelectedCategories("");
    setShowBooks(books);
  };

  //request book
  const requestBook = async (bookname, image) => {
    if (auth?.name === null) {
      navigate("/login");
      return;
    }
    let hasBook = false;
    let status = "";
    for (let i = 0; i < myIssueBooks.length; i++) {
      if (
        myIssueBooks[i].bookName === bookname &&
        myIssueBooks[i].status === "Requested"
      ) {
        hasBook = true;
        status = "Requested";
      }
      if (
        myIssueBooks[i].bookName === bookname &&
        myIssueBooks[i].status === "Issued"
      ) {
        hasBook = true;
        status = "Issued";
      }
    }
    if (hasBook && status === "Issued") {
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
    if (hasBook && status === "Requested") {
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
    try {
      await axios
        .post(
          `/api/v1/book/request-book/${bookname}/${auth?.user}/${auth?.name}/${image}`
        )
        .then((res) => {
          if (res?.data?.success) {
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

  async function getCheckboxValue() {
    var res = "";
    for (let i = 0; i < categories.length; i++) {
      if (document.getElementById(categories[i].name).checked === true) {
        var pl1 = categories[i].name;
        res = res + pl1 + ",";
      }
    }
    setSelectedCategories(res);
  }

  const getFilteredBooks = async () => {
    const selCats = selectedCategories.split(",");
    selCats.pop();
    setShowBooks([]);
    setFilterBooks([]);
    for (let i = 0; i < selCats.length; i++) {
      try {
        await axios
          .get(`/api/v1/book/books-by-category/${selCats[i]}`)
          .then((res) => {
            if (res.data.success) {
              for (let i = 0; i < res?.data.data.length; i++) {
                filetredBooks.push(res?.data.data[i]);
              }
            } else {
              toast.warn(res?.data?.message, {
                position: "top-left",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              document.getElementById("loading").innerText = res?.data?.message;
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
    setShowBooks(filetredBooks);
  };

  useEffect(() => {
    getAllCategories();
    getMyIssueBooks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!selectedCategories.length) getAllBooks();
  }, [selectedCategories.length]);

  useEffect(() => {
    if (selectedCategories.length) getFilteredBooks();
    // eslint-disable-next-line
  }, [selectedCategories.length]);

  return (
    <>
      <div style={{ width: "100%" }}>
        <ToastContainer />
        <div
          className="row m-auto"
          style={{ maxWidth: "100%", height: "100dvh" }}
        >
          <div
            className="col-md-3"
            style={{ background: "Gray", padding: "10px 20px", color: "white" }}
          >
            <h2 className="text-center">All Categories</h2>
            <hr />
            <div
              className="categories"
              style={{
                height: "350px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ul
                style={{ listStyle: "none", height: "80%" }}
                className="bg-dark rounded"
              >
                {categories?.map((c, i) => {
                  return (
                    <li key={i} className="form-check my-2">
                      <input
                        type="checkbox"
                        id={c.name}
                        className="form-check-input"
                        onChange={(e) => {
                          getCheckboxValue();
                          // getFilteredBooks();
                        }}
                      />
                      <label htmlFor={c.name} className="form-check-label">
                        {c.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <button
                className="btn btn-danger"
                onClick={() => {
                  resetCategories();
                }}
              >
                Reset
              </button>
            </div>
          </div>
          {/* Main page */}
          <div className="col-md-9 text-center d-flex flex-column align-itmes-center">
            {showBooks.length > 0 ? (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {showBooks?.map((b, i) => {
                    return (
                      <div
                        className="card bookCard"
                        key={i}
                        style={{
                          // width: "fit-content",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                          width: "150px",
                        }}
                      >
                        <img
                          src={process.env.REACT_APP_IMAGE_PATH + b?.image}
                          alt="book"
                          style={{
                            maxWidth: "100px",
                            aspectRatio: "10/12",
                            padding: "5px",
                            border: "1px solid black",
                          }}
                        />
                        <div className="details">
                          <h5 className="text-center my-2">{b?.name}</h5>
                          <h6 className="text-center">Rs {b?.price}/-</h6>
                        </div>
                        <div>
                          {auth?.user_role === "user" ||
                          auth?.user_role === null ? (
                            <>
                              <button
                                className="btn btn-warning btn-sm m-1"
                                onClick={() => {
                                  requestBook(b?.name, b?.image);
                                }}
                              >
                                Request
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                          <button
                            className="btn btn-outline-secondary btn-sm m-1"
                            onClick={() => navigate(`/book-details/${b?.name}`)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p id="loading">Loading....</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
