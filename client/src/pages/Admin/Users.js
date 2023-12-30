import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [keywords, setKeywords] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (keywords === "") {
      getUsers();
    } else {
      searchUsers();
    }
    // eslint-disable-next-line
  }, [keywords]);

  const getUsers = async () => {
    try {
      await axios
        .get("/api/v1/users/get-all-users")
        .then((res) => {
          if (res?.data?.success) {
            setUsers(res?.data?.data);
          } else {
            document.getElementById("loading").innerText = res?.data?.message;
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (email) => {
    try {
      await axios
        .delete(`/api/v1/users/remove-user/${email}`)
        .then((res) => {
          toast.info(res?.data?.message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          getUsers();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const searchUsers = async () => {
    try {
      await axios
        .get(`/api/v1/users/search-users/${keywords}`)
        .then((res) => {
          setUsers(res?.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: "100%!important" }}
      >
        <ToastContainer />
        <h2 className="text-center">All Users</h2>
        {/* main div */}
        <div className="card" style={{ width: "90%" }}>
          {/* search div */}
          <div className="w-100 d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/admin")}
            >
              Back
            </button>
            <form className="d-flex search-form" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search name or email"
                aria-label="Search"
                onChange={(e) => {
                  e.preventDefault();
                  setKeywords(e.target.value);
                }}
              />
            </form>
          </div>
          {/* table div */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Password</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users?.map((u, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <p>
                            <strong>{u.name}</strong>
                          </p>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          {u.user_role === "user" ? u.password : "********"}
                        </td>
                        <td>{u.phone}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteUser(u.email);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
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
            {/* table div */}
          </div>
          {/* main div */}
        </div>
      </div>
    </>
  );
};

export default Users;
