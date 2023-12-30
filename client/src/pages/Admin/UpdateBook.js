import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBook = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [name, setName] = useState("");
  const [bookname, setBookName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState(0);
  const [copies, setCopies] = useState(0);
  const [addedby, setAddedBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");

  const [currentData, setCurrentData] = useState({
    name: "",
    description: "",
    author: "",
    price: null,
    copies: null,
    addedby: addedby,
    selectedCategories: "",
  });
  const data = {
    name: name,
    description: description,
    author: author,
    price: price,
    copies: copies,
    addedby: addedby,
    selectedCategories: selectedCategories,
  };

  //get single book by name
  const getSingleBook = async (bookname) => {
    try {
      await axios
        .get(`/api/v1/book/get-book/${bookname}`)
        .then((res) => {
          setName(res.data[0].name);
          setBookName(res.data[0].name);
          setDescription(res.data[0].description);
          setAuthor(res.data[0].author);
          setPrice(res.data[0].price);
          setCopies(res.data[0].copies);
          setAddedBy(res.data[0].published_by);
          setSelectedCategories(res.data[0].selectedCategories);

          //setting current data for validation
          setCurrentData({
            name: res.data[0].name,
            description: res.data[0].description,
            author: res.data[0].author,
            price: res.data[0].price,
            copies: res.data[0].copies,
            selectedCategories: res.data[0].selectedCategories,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  //get all books
  const getAllBooks = async () => {
    try {
      axios
        .get("/api/v1/book/get-books")
        .then((res) => {
          setBooks(res?.data);
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

  useEffect(() => {
    if (params.name) {
      getSingleBook(params.name);
      getAllCategories();
      getAllBooks();
    }
  }, [params.name]);

  function getCheckboxValue() {
    var res = "";
    for (let i = 0; i < categories.length; i++) {
      if (document.getElementById(categories[i].name).checked === true) {
        var pl1 = categories[i].name;
        res = res + pl1 + ",";
      }
    }
    setSelectedCategories(res);
  }

  //update the book
  const updateBook = async () => {
    if (name === "" || description === "" || author === "") {
      toast.warn("All fields are required!", {
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
    if (price < 0 || copies < 1) {
      toast.warn("price should not be negative and atleast 1 copy is needed!", {
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
    let includsBook = false;
    for (let i = 0; i < books.length; i++) {
      const book = books[i].name;
      if (book === name && currentData.name !== name) {
        includsBook = true;
      } else {
        includsBook = false;
      }
    }
    if (includsBook) {
      toast.warn("This Named Book Already Exists! Try With Different Name...", {
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
      name === currentData.name &&
      description === currentData.description &&
      author === currentData.author &&
      price === currentData.price &&
      copies === currentData.copies &&
      selectedCategories === currentData.selectedCategories
    ) {
      toast.warn("Change Atleast 1 Field To Update!", {
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

    const config = {
      headres: {
        "Content-Type": "multipart/form-data",
      },
    };

    await axios
      .post(`/api/v1/book/update-book/${bookname}`, data, config)
      .then((res) => {
        if (res.data.success) {
          setBookName(name);
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
          navigate("/dashboard/admin/book");
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
  };
  setTimeout(() => {
    const scats = selectedCategories.split(",");
    // eslint-disable-next-line
    scats.map((sc) => {
      if (sc !== "") {
        document.getElementById(sc).checked = true;
      }
    });
    clearTimeout();
  }, 1000);

  return (
    <>
      <form onSubmit={updateBook}>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <ToastContainer />
          <div className="card" style={{ width: "90%" }}>
            <h3 style={{ textAlign: "center" }}>Update Book Details</h3>
            <div className="mb-3">
              <input
                type="text"
                className="form-control name"
                name="name"
                placeholder="Enter book name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control description"
                name="description"
                placeholder="Enter book description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control author"
                name="author"
                placeholder="Enter book author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price">Book price:</label>
              <input
                type="number"
                className="form-control price"
                name="price"
                placeholder="Enter book price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="copies">Number of copies:</label>
              <input
                type="number"
                className="form-control copies"
                name="copies"
                placeholder="Enter book copies"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="addedby">Published By:</label>
              <input
                type="text"
                className="form-control addedby"
                name="addedby"
                placeholder="Added By"
                value={addedby}
                disabled
              />
            </div>
            {/* Category */}
            <p>Selected Categories: {selectedCategories}</p>
            <div
              className="card mb-3"
              style={{
                maxHeight: "100px",
                overflowY: "scroll",
                padding: "0, 5px",
              }}
            >
              {categories.map((c, i) => {
                return (
                  <div className="form-check" key={i}>
                    <input
                      type="checkbox"
                      id={c.name}
                      className="form-check-input"
                      onChange={(e) => {
                        getCheckboxValue();
                      }}
                    />
                    <label htmlFor={c.name} className="form-check-label">
                      {c.name}
                    </label>
                  </div>
                );
              })}
            </div>
            {/* Category */}
            <div className="mb-3">
              <button
                className="btn btn-primary mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  updateBook();
                }}
              >
                Update
              </button>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard/admin/book");
                }}
              >
                back
              </button>
            </div>
            <hr />
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateBook;
