import React, { useContext, useState } from "react";
import searchBooks from "../context/searchBooksContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBar = () => {
  const books = useContext(searchBooks);
  const [keywords, setKeywords] = useState("");
  const navigate = useNavigate();

  const getSearchBooks = async () => {
    if (keywords !== "") {
      navigate("/search");
      try {
        await axios
          .get(`/api/v1/book/search-books/${keywords}`)
          .then((res) => {
            if (res?.data?.success) {
              books.setVal(res?.data?.data);
              books.setMsg("");
            } else {
              books.setVal([]);
              books.setMsg(res?.data?.message);
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.warn("Enter valid book name!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
    }
  };

  return (
    <div>
      <ToastContainer />
      <form className="d-flex search-form" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => {
            e.preventDefault();
            setKeywords(e.target.value);
          }}
        />
        <button
          className="btn btn-secondary me-2 rounded-5"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            getSearchBooks();
          }}
        >
          <i className="bi bi-search" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
