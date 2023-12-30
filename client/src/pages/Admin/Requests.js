import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    try {
      await axios
        .get(`/api/v1/book/get-all-requests`)
        .then((res) => {
          if (res?.data?.success) {
            setRequests(res.data);
          } else {
            document.getElementById("loading").innerText = res?.data?.message;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequest = async (bookname, username, email) => {
    try {
      await axios
        .put(`/api/v1/book/reject-request/${bookname}/${username}/${email}`)
        .then((res) => {
          if (res.data.success) {
            getRequests();
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
        });
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async (bookname, username, email) => {
    try {
      await axios
        .put(`/api/v1/book/approve-request/${bookname}/${username}/${email}`)
        .then((res) => {
          if (res.data.success) {
            getRequests();
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
        });
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
          <div className="w-100">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/admin")}
            >
              Back
            </button>
          </div>
          {/* table div */}
          <div
            className="table-responsive"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <table className="table">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px black solid",
                  }}
                >
                  <th className="py-4">Book Image</th>
                  <th className="py-4">Book Name</th>
                  <th className="py-4">User Name</th>
                  <th className="py-4">Email</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Requested On</th>
                  <th className="py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((mb, i) => {
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px black solid",
                        }}
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
                        <td>
                          <h6>{mb.bookName}</h6>
                        </td>
                        <td>
                          <h6>{mb.userName}</h6>
                        </td>
                        <td>
                          <h6>{mb.email}</h6>
                        </td>
                        <td>
                          <h6>{mb.status}</h6>
                        </td>
                        <td>
                          <h6>{mb.requestedOn}</h6>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <button
                              className="btn btn-primary my-1"
                              onClick={() =>
                                approveRequest(
                                  mb.bookName,
                                  mb.userName,
                                  mb.email
                                )
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger my-1"
                              onClick={() =>
                                rejectRequest(
                                  mb.bookName,
                                  mb.userName,
                                  mb.email
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
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
      </div>
    </>
  );
};

export default Requests;
