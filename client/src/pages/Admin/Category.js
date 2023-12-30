import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/category.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [values, setValues] = useState("");
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState("");
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
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
    if (keywords === "") {
      getAllCategories();
    } else {
      searchCategory();
    }
    // eslint-disable-next-line
  }, [keywords]);

  // create category
  const addNewCategory = (e) => {
    e.preventDefault();
    if (values === "") {
      toast.warn("Category Name should be atleast 3 characters long!", {
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
      //check if category exists
      axios
        .post("/api/v1/category/get-category", values)
        .then((res) => {
          if (res?.data?.data?.length > 0) {
            toast.warn("This Category Already Exists!", {
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
            //create category
            axios
              .post("/api/v1/category/create-category", values)
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
                  document.querySelector(".input").value = "";
                  setValues("");
                  getAllCategories();
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
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (name) => {
    try {
      axios
        .delete(`/api/v1/category/remove-categories/${name}`)
        .then((res) => {
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
          getAllCategories();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const searchCategory = async () => {
    try {
      await axios
        .get(`/api/v1/category/search-category/${keywords}`)
        .then((res) => {
          setCategories(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="p-3 pt-0 text-center"
        style={{
          width: "100%",
        }}
      >
        <ToastContainer />
        <h2>Manage Category</h2>
        <div className="row">
          <div
            className="col-md-4"
            style={{
              textOverflow: "ellipsis",
              height: "min-content",
            }}
          >
            <div className="card w-100">
              <h6 className="text-center mb-4">Add Category</h6>
              <form action="" onSubmit={addNewCategory}>
                <div className="mb-3">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    placeholder="Enter Category Name"
                    className="form-control rounded-0 input"
                    name="name"
                    onChange={handleInput}
                  />
                </div>
                <div className="d-flex flex-wrap w-100">
                  <button type="submit" className="btn btn-success m-2">
                    Add
                  </button>
                  <Link
                    to="/dashboard/admin"
                    className="btn btn-default border m-2"
                  >
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card w-100 d-flex justify-content-between align-items-center">
              {/* search bar */}
              <form className="d-flex search-form w-100" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search Category"
                  aria-label="Search"
                  onChange={(e) => {
                    e.preventDefault();
                    setKeywords(e.target.value);
                  }}
                />
              </form>
              {categories.length > 0 ? (
                categories.map((c, i) => {
                  return (
                    <div
                      key={i}
                      className="card w-100 d-flex flex-row justify-content-between align-items-center flex-wrap"
                    >
                      <h6 className="cat">{c.name}</h6>
                      <button
                        className="btn btn-danger"
                        onClick={async (e) => {
                          e.preventDefault();
                          deleteCategory(c.name);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
