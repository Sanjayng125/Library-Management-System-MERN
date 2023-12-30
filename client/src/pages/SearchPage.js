import React, { useContext, useEffect, useState } from "react";
import searchBooks from "../context/searchBooksContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../context/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchPage = () => {
  const [auth] = useAuth();
  const books = useContext(searchBooks);
  const [showBooks, setShowBooks] = useState([]);
  const navigate = useNavigate();
  const [myIssueBooks, setMyIssueBooks] = useState([]);

  useEffect(() => {
    setShowBooks(books.val);
    getMyIssueBooks();
    // eslint-disable-next-line
  }, [books.val]);

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

  return (
    <>
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <ToastContainer />
          {showBooks.length > 0 && books.msg === "" ? (
            showBooks?.map((b, i) => {
              return (
                <div
                  className="card"
                  key={i}
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <img
                    src={`http://localhost:8080/images/` + b.image}
                    alt="book"
                    style={{
                      maxWidth: "120px",
                      aspectRatio: "10/12",
                      padding: "5px",
                    }}
                  />
                  <div className="details">
                    <h5 className="text-center my-2">{b.name}</h5>
                    <h6 className="text-center">Rs {b.price}/-</h6>
                  </div>
                  <div>
                    <button
                      className="btn btn-warning m-1"
                      onClick={(e) => {
                        e.preventDefault();
                        requestBook(b.name, b.image);
                      }}
                    >
                      Request
                    </button>
                    <button
                      className="btn btn-outline-secondary m-1"
                      onClick={() => navigate(`/book-details/${b.name}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          ) : !showBooks.length && books.msg !== "" ? (
            <p>{books.msg}</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
