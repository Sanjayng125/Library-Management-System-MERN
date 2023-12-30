import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const History = () => {
  const [allHistory, setAllHistory] = useState([]);
  // eslint-disable-next-line
  const [filterBooks, setFilterBooks] = useState([]);
  const [showHistory, setShowHistory] = useState([]);
  const [keywords, setKeywords] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllIssueHistory();
  }, []);

  const getAllIssueHistory = async () => {
    try {
      await axios
        .get(`/api/v1/book/get-history`)
        .then((res) => {
          if (res?.data?.success) {
            setAllHistory(res.data.data);
            setShowHistory(res.data.data);
          } else {
            document.getElementById("loading").innerText = res?.data?.message;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  //delete rejected requests
  const deleteRejectedRequests = async (
    bookname,
    requestedOn,
    username,
    email
  ) => {
    try {
      await axios
        .delete(
          `/api/v1/book/delete-rejected/${bookname}/${username}/${email}/${requestedOn}`
        )
        .then((res) => {
          if (res.data.success) {
            getAllIssueHistory();
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
    setShowHistory([]);
    filterBooks.splice(0);
    for (let i = 1; i < 3; i++) {
      if (document.getElementById(`flexCheckDefault${[i]}`).checked) {
        const filter = await document.getElementById(`flexCheckDefault${[i]}`)
          .value;
        for (let i = 0; i < allHistory.length; i++) {
          if (allHistory[i].status === filter) {
            filterBooks.push(allHistory[i]);
          }
        }
      }
    }
    setShowHistory(filterBooks);
  };

  const search = async () => {
    try {
      await axios
        .get(`/api/v1/book/search-history/${keywords}`)
        .then((res) => {
          setShowHistory(res.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (keywords === "") {
      getAllIssueHistory();
    } else {
      search();
    }
    // eslint-disable-next-line
  }, [keywords]);

  return (
    <>
      <div
        style={{ width: "90%" }}
        className="d-flex justify-content-evenly align-items-center m-2"
      >
        <div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="flexCheckDefault1"
              name="flexRadioDefault"
              onChange={() => checkRadioButton()}
              value={"Returned"}
            />
            <label
              htmlFor="flexCheckDefault1"
              className="form-check-label mx-1"
            >
              Only Returned
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="flexCheckDefault2"
              name="flexRadioDefault"
              value={"Rejected"}
              onChange={() => checkRadioButton()}
            />
            <label
              htmlFor="flexCheckDefault2"
              className="form-check-label mx-1"
            >
              Only Rejected
            </label>
          </div>
          <button
            className="btn btn-warning m-2"
            onClick={() => {
              for (let i = 1; i < 3; i++) {
                document.getElementById(
                  `flexCheckDefault${[i]}`
                ).checked = false;
              }
              setShowHistory(allHistory);
            }}
          >
            Reset
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() => navigate("/dashboard/admin")}
          >
            Back
          </button>
        </div>
        <form className="d-flex search-form w-50" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search book name or email"
            aria-label="Search"
            onChange={(e) => {
              e.preventDefault();
              setKeywords(e.target.value);
            }}
          />
        </form>
      </div>
      <div
        className="table-responsive"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToastContainer />
        {/* illi hakbek */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr
                style={{
                  borderTop: "1px black solid",
                  borderBottom: "1px black solid",
                }}
              >
                <th scope="col">Book Image</th>
                <th scope="col">Book Name</th>
                <th scope="col">User Name</th>
                <th scope="col">User Email</th>
                <th scope="col">Status</th>
                <th scope="col">Requested On</th>
                <th scope="col">Approved On</th>
                <th scope="col">Returned On</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showHistory.length > 0 ? (
                showHistory.map((mb, i) => {
                  return (
                    <tr
                      style={{
                        borderBottom: "1px black solid",
                      }}
                      key={i}
                    >
                      <td className="py-1">
                        <img
                          src={process.env.REACT_APP_IMAGE_PATH + mb.image}
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
                      <td>{mb.bookName}</td>
                      <td>{mb.userName}</td>
                      <td>{mb.email}</td>
                      <td>{mb.status}</td>
                      <td>{mb.requestedOn}</td>
                      <td>
                        {mb.status === "Requested"
                          ? "Still not Approved"
                          : mb.approvedOn}
                      </td>
                      <td>
                        {mb.status === "Requested"
                          ? "Not returned"
                          : mb.returnedOn}
                      </td>
                      <td>
                        {mb?.status === "Rejected" ? (
                          <>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                deleteRejectedRequests(
                                  mb.bookName,
                                  mb.requestedOn,
                                  mb.userName,
                                  mb.email
                                );
                              }}
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
                })
              ) : (
                <tr>
                  <td id="loading">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default History;
