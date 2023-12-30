import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Book = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState(0);
  const [copies, setCopies] = useState(0);
  const [photo, setPhoto] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);


  //get all books
  const getAllBooks = async () => {
    document.querySelector(".addedby").value = auth?.name;
    try {
      axios
        .get("/api/v1/book/get-books")
        .then((res) => {
          if (res?.data?.success) {
            setBooks(res?.data?.data);
          } else {
            document.getElementById("bookLoading").innerText =
              res?.data?.message;
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
    setLoading(true);
    try {
      axios
        .get("/api/v1/category/get-categories")
        .then((res) => {
          setCategories(res.data.data);
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        });
      } catch (error) {
        console.log(error);
        setLoading(false)
    }
  };

  useEffect(() => {
    getAllCategories();
    if (keywords === "") {
      getAllBooks();
    } else {
      search();
    }
    // eslint-disable-next-line
  }, [keywords]);

  //creating new book
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!categories.length && !loading){
      toast.warn("Add Categories First!", {
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
    if (name === "" || description === "" || author === "" || photo === "" || selectedCategories === "") {
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
    let includsBook = false;
    for (let i = 0; i < books.length; i++) {
      const book = books[i].name;
      if (book === name) {
        includsBook = true;
      } else {
        includsBook = false;
      }
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
    } else {
      getCheckboxValue();
      const formadata = new FormData();
      formadata.append("name", name);
      formadata.append("description", description);
      formadata.append("author", author);
      formadata.append("addedby", auth?.name);
      formadata.append("selectedCategories", selectedCategories);
      formadata.append("photo", photo);
      formadata.append("price", price);
      formadata.append("copies", copies);

      const config = {
        headres: {
          "Content-Type": "multipart/form-data",
        },
      };

      axios
        .post("/api/v1/book/add-book", formadata, config)
        .then((res) => {
          toast.info(res.data.message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          getAllBooks();

          setName("");
          setDescription("");
          setAuthor("");
          setPhoto("");
          setPrice(0);
          setCopies(0);
          setSelectedCategories("");
          document.querySelector(".photo").value = "";
          categories.forEach((book) => {
            document.getElementById(book.name).checked = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

  const removeBook = async (name, img) => {
    try {
      await axios
        .delete(`/api/v1/book/remove-books/${name}/${img}`)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message, {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            getAllBooks();
          } else {
            toast.error(res.data.message, {
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

  const search = async () => {
    try {
      await axios
        .get(`/api/v1/book/search-books/${keywords}`)
        .then((res) => {
          if (res?.data?.success) {
            setBooks(res?.data?.data);
          } else {
            setBooks([]);
            if (!books.length)
              document.getElementById("bookLoading").innerText =
                "No Results Available!";
          }
          // setBooks(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <ToastContainer />
        <h1 style={{ textAlign: "center" }}>Manage Books</h1>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="card" style={{ width: "90%" }}>
            <div className="row">
              <div className="col-md-8">
                <h3 style={{ textAlign: "center" }}>Add New Book</h3>
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
                    disabled
                  />
                </div>
                {/* Category */}
                <p>Select Categories:</p>
                <div
                  className="card mb-3"
                  style={{
                    maxHeight: "100px",
                    overflowY: "scroll",
                    padding: "0, 5px",
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((c, i) => {
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
                    })
                  ) : loading ? (
                    <p id="categoryLoading">Loading...</p>
                  ) : (
                    <p id="categoryLoading">Not Available!</p>
                  )}
                </div>
                {/* Category */}

                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control photo"
                    name="photo"
                    placeholder="Select Photo"
                    accept="image/*"
                    onChange={(e) => {
                      e.preventDefault();
                      setPhoto(e.target.files[0]);
                    }}
                  />
                </div>
                {photo ? (
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="book"
                      name="photoPreview"
                      className="img img-responsive"
                      height={"200px"}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="mb-3">
                  <button className="btn btn-primary mx-1">Add</button>
                  <button
                    className="btn btn-outline-secondary mx-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/dashboard/admin");
                    }}
                  >
                    back
                  </button>
                </div>
                <hr />
              </div>
              {/* col 2 */}
              <div className="col-md-4">
                <h4 style={{ textAlign: "center" }}>All Books</h4>
                {/* search bar */}
                <div className="d-flex search-form w-100" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search book name"
                    aria-label="Search"
                    onChange={(e) => {
                      e.preventDefault();
                      setKeywords(e.target.value);
                    }}
                  />
                </div>
                {books.length > 0 ? (
                  books.map((b, i) => {
                    return (
                      <div
                        className="card w-100 mx-auto"
                        // style={{
                        //   width: "100%",
                        //   display: "flex",
                        //   flexDirection: "row",
                        //   justifyContent: "space-between",
                        //   alignItems: "center",
                        // }}
                        key={i}
                      >
                        <img
                          src={process.env.REACT_APP_IMAGE_PATH + b.image}
                          alt={b.name + "image"}
                          className="img-fluid img-thumbnail card-img-top"
                          // style={{
                          //   width: "100px",
                          //   height: "120px",
                          //   border: "1px black solid",
                          //   padding: "5px",
                          //   borderRadius: "4px",
                          //   margin: "5px",
                          // }}
                        />
                        <div
                          className="card-body p-1"
                          // style={{
                          //   display: "flex",
                          //   flexDirection: "column",
                          //   justifyContent: "center",
                          //   alignItems: "center",
                          //   margin: "5px",
                          //   textAlign: "center",
                          // }}
                        >
                          <p className="m-1">
                            <strong>{b.name}</strong>
                          </p>
                          <p className="m-1">{b.description}</p>
                          <p className="m-1">Copies left: {b.copies}</p>
                        </div>
                        <div className="card-body p-1">
                          <button
                            className="btn btn-danger btn-sm m-1"
                            onClick={(e) => {
                              e.preventDefault();
                              removeBook(b.name, b.image);
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-warning btn-sm m-1"
                            onClick={(e) => {
                              e.preventDefault();
                              //pending
                              navigate(
                                `/dashboard/admin/book/update-book/${b.name}`
                              );
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-primary btn-sm m-1"
                            onClick={(e) => {
                              e.preventDefault();
                              //pending
                              navigate(
                                `/dashboard/admin/book/book-details/${b.name}`
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p id="bookLoading" className="text-center bookLoading">
                    Loading...
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Book;
