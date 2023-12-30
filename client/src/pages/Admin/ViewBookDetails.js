import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const ViewBookDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState([]);
  // eslint-disable-next-line
  const [sameCategoryBooks, setSameCategoryBooks] = useState([]);

  useEffect(() => {
    getSingleBook(params.name);
    // eslint-disable-next-line
  }, [params.name]);

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

  const getSameCategoryBooks = async (category) => {
    try {
      await axios
        .get(`/api/v1/book/similar-book/${category}`)
        .then((res) => {
          setSameCategoryBooks(res.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ width: "90%" }}>
          {book.map((b, i) => {
            return (
              <div
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
                    // padding: "10px 100px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={process.env.REACT_APP_IMAGE_PATH + b.image}
                    alt="book"
                    style={{
                      maxWidth: "330px",
                      // height: "320px",
                      aspectRatio: "9/12",
                      border: "1px black solid",
                      padding: "5px",
                      borderRadius: "4px",
                      margin: "5px",
                      objectFit: "fill",
                    }}
                  />
                </div>
                <div className="details text-center" style={{ width: "100%" }}>
                  <h2 className="text-center mb-4">{b.name}</h2>
                  <h4>Price: Rs {b.price}/-</h4>
                  <h4>In Library: {b.copies > 0 ? "Yes" : "No"}</h4>
                  <h5>Description: {b.description}</h5>
                  <h6>Author: {b.author}</h6>
                  <h6>Published By: {b.published_by}</h6>
                  <h6>Copies: {b.copies}</h6>
                  <button
                    className="btn btn-outline-secondary m-2"
                    onClick={() => navigate(`/dashboard/admin/book`)}
                  >
                    Back
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewBookDetails;
