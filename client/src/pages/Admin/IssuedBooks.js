import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const IssuedBooks = () => {
  const [keywords, setKeywords] = useState("");
  const [issuedBooks, setIssuedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (keywords === "") {
      getissuedBooks();
    } else {
      search();
    }
    // eslint-disable-next-line
  }, [keywords]);

  const getissuedBooks = async () => {
    try {
      await axios
        .get(`/api/v1/book/get-issuedBooks`)
        .then((res) => {
          if (res?.data?.success) {
            setIssuedBooks(res?.data.data);
          } else {
            document.getElementById("loading").innerText = res?.data?.message;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const search = async () => {
    try {
      await axios
        .get(`/api/v1/book/search-issued/${keywords}`)
        .then((res) => {
          setIssuedBooks(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          className="card"
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className=" d-flex justify-content-between w-100">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/admin")}
            >
              Back
            </button>
            {/* search bar */}
            <form className="d-flex search-form w-50" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search name, book name or email"
                aria-label="Search"
                onChange={(e) => {
                  e.preventDefault();
                  setKeywords(e.target.value);
                }}
              />
            </form>
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
            <table className="table mt-2">
              <thead>
                <tr
                  style={{
                    borderTop: "1px black solid",
                    borderBottom: "1px black solid",
                  }}
                >
                  <th className="py-4">Book Image</th>
                  <th className="py-4">Book Name</th>
                  <th className="py-4">User Name</th>
                  <th className="py-4">User Email</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Requested On</th>
                  <th className="py-4">Approved On</th>
                  <th className="py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.length > 0 ? (
                  issuedBooks.map((mb, i) => {
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
                          <h6>{mb.approvedOn}</h6>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <button className="btn btn-primary my-1">
                              Notify
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

export default IssuedBooks;
