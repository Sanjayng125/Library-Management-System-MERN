import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageIssueBooks = () => {
  const [auth] = useAuth();
  const [myIssueBooks, setMyIssueBooks] = useState([]);
  // eslint-disable-next-line
  const [filterBooks, setFilterBooks] = useState([]);
  const [showMyIssueBooks, setShowMyIssueBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (bookName === "") {
      getMyIssueBooks();
    } else {
      search();
    }
    // eslint-disable-next-line
  }, [bookName]);

  const getMyIssueBooks = async () => {
    try {
      await axios
        .get(`/api/v1/book/get-requested-books/${auth?.name}/${auth?.user}`)
        .then((res) => {
          setMyIssueBooks(res?.data);
          setShowMyIssueBooks(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  //cancel book request
  const cancelRequest = async (bookname) => {
    try {
      await axios
        .delete(
          `/api/v1/book/cancel-request/${bookname}/${auth?.name}/${auth?.user}`
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

  //return book
  const returnBook = async (bookname) => {
    try {
      await axios
        .put(`/api/v1/book/return-book/${bookname}/${auth?.name}/${auth?.user}`)
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

  //delete rejected requests
  const deleteRejectedRequests = async (bookname, requestedOn, email) => {
    try {
      await axios
        .delete(
          `/api/v1/book/delete-rejected/${bookname}/${auth?.name}/${auth?.user}/${requestedOn}`
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

  const checkRadioButton = async () => {
    setShowMyIssueBooks([]);
    filterBooks.splice(0);
    for (let i = 1; i < 5; i++) {
      if (document.getElementById(`flexCheckDefault${[i]}`).checked) {
        const filter = await document.getElementById(`flexCheckDefault${[i]}`)
          .value;
        for (let i = 0; i < myIssueBooks.length; i++) {
          if (myIssueBooks[i].status === filter) {
            filterBooks.push(myIssueBooks[i]);
          }
        }
      }
    }
    setShowMyIssueBooks(filterBooks);
  };

  //search
  const search = async () => {
    try {
      await axios
        .get(
          `/api/v1/book/search-user-books/${bookName}/${auth?.name}/${auth?.user}`
        )
        .then((res) => {
          setShowMyIssueBooks(res?.data);
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
        <div
          className="card"
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="card w-100">
            <div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="flexCheckDefault1"
                  name="flexRadioDefault"
                  onChange={() => checkRadioButton()}
                  value={"Requested"}
                />
                <label
                  htmlFor="flexCheckDefault1"
                  className="form-check-label mx-1"
                >
                  Only Pending Requests
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="flexCheckDefault2"
                  name="flexRadioDefault"
                  value={"Issued"}
                  onChange={() => checkRadioButton()}
                />
                <label
                  htmlFor="flexCheckDefault2"
                  className="form-check-label mx-1"
                >
                  Only Issued
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="flexCheckDefault3"
                  name="flexRadioDefault"
                  value={"Rejected"}
                  onChange={() => checkRadioButton()}
                />
                <label
                  htmlFor="flexCheckDefault3"
                  className="form-check-label mx-1"
                >
                  Only Rejected
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="flexCheckDefault4"
                  name="flexRadioDefault"
                  value={"Returned"}
                  onChange={() => checkRadioButton()}
                />
                <label
                  htmlFor="flexCheckDefault4"
                  className="form-check-label mx-1"
                >
                  Only Returned
                </label>
              </div>
              <button
                className="btn btn-warning m-2"
                onClick={() => {
                  for (let i = 1; i < 5; i++) {
                    document.getElementById(
                      `flexCheckDefault${[i]}`
                    ).checked = false;
                  }
                  setShowMyIssueBooks(myIssueBooks);
                }}
              >
                Reset
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={() => navigate("/dashboard/user")}
              >
                Back
              </button>
            </div>
            <form className="d-flex search-form w-100" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search book name"
                aria-label="Search"
                onChange={(e) => {
                  e.preventDefault();
                  setBookName(e.target.value);
                }}
              />
            </form>
          </div>
          <div className="table-responsive w-100">
            <table className="table">
              <thead>
                <tr
                  style={{
                    borderTop: "1px black solid",
                    borderBottom: "1px black solid",
                  }}
                >
                  <th scope="col">Book Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Requested On</th>
                  <th scope="col">Approved On</th>
                  <th scope="col">Returned On</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showMyIssueBooks.map((mb, i) => {
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px black solid",
                      }}
                    >
                      <td>
                        <img
                          src={`http://localhost:8080/images/` + mb.image}
                          alt="book"
                          style={{
                            maxWidth: "100px",
                            aspectRatio: "10/12",
                            border: "1px black solid",
                            padding: "5px",
                            borderRadius: "4px",
                            margin: "5px",
                            objectFit: "fill",
                          }}
                        />
                      </td>
                      <td>
                        <h6>{mb.bookName}</h6>
                      </td>
                      <td>
                        <h6>{mb.status}</h6>
                      </td>
                      <td>
                        <h6>{mb.requestedOn}</h6>
                      </td>
                      <td>
                        <h6>
                          {mb.status === "Requested"
                            ? "Still not Approved"
                            : mb.approvedOn}
                        </h6>
                      </td>
                      <td>
                        <h6>
                          {mb.status === "Requested"
                            ? "Not returned"
                            : mb.returnedOn}
                        </h6>
                      </td>
                      <td>
                        {mb?.status === "Requested" ? (
                          <>
                            <button
                              className="btn btn-warning"
                              onClick={() => cancelRequest(mb.bookName)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : mb?.status === "Issued" ? (
                          <>
                            <button
                              className="btn btn-primary"
                              onClick={() => returnBook(mb.bookName)}
                            >
                              Return
                            </button>
                          </>
                        ) : mb?.status === "Rejected" ? (
                          <>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                deleteRejectedRequests(
                                  mb.bookName,
                                  mb.requestedOn,
                                  mb.email
                                )
                              }
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <h6>Book Returned</h6>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageIssueBooks;
