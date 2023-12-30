import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentData, setCurrentData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const data = {
    name: name,
    email: email,
    phone: phone,
  };

  useEffect(() => {
    if (auth?.name && auth?.user) {
      getUserDetails(auth?.name, auth?.user);
      //   getAllallUsers();
    }
  }, [auth?.name, auth?.user]);

  //get user details by name
  const getUserDetails = async (username, email) => {
    try {
      await axios
        .get(`/api/v1/users/get-user/${username}/${email}`)
        .then((res) => {
          //setting current email for reference
          setCurrentEmail(res.data.email);

          setName(res.data.name);
          setEmail(res.data.email);
          setPhone(res.data.phone);

          //setting current data for validation
          setCurrentData({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  //update the user details
  const updateProfileDetails = async () => {
    if (name === "" || email === "" || phone === "") {
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
    const userExists = await axios.get(`/api/v1/users/check-user/${email}`);
    if (userExists.data && currentData.email !== email) {
      toast.warn(
        "This Email User Already Exists! Try With Different Email...",
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }
    if (
      name === currentData.name &&
      email === currentData.email &&
      phone === currentData.phone
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
      .put(`/api/v1/users/update-user/${currentEmail}`, data, config)
      .then((res) => {
        if (res.data.success) {
          setCurrentEmail(email);
          getUserDetails(name, email);
          setAuth({
            ...auth,
            name: name,
            phone: phone,
            user: email,
          });
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
  };

  return (
    <>
      <form onSubmit={updateProfileDetails}>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <ToastContainer />
          <div className="card" style={{ width: "90%" }}>
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
                className="form-control email"
                name="email"
                placeholder="Enter book email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control phone"
                name="phone"
                placeholder="Enter book phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button
                className="btn btn-primary mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  updateProfileDetails();
                }}
              >
                Update
              </button>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard/user");
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

export default UpdateProfile;
