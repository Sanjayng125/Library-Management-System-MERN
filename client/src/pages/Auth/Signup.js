import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/login.css";
import validation from "../validation/SignupValidation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const err = validation(values);
      setErrors(err);
      if (
        err.name === "" &&
        err.email === "" &&
        err.password === "" &&
        err.phone === ""
      ) {
        axios
          .post("/api/v1/auth/signup", values)
          .then((res) => {
            if (res?.data?.success) {
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
              navigate("/login");
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
      } else {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginBody">
      <ToastContainer />
      <div className="bg-white p-3 rounded w-25" style={{ minWidth: "250px" }}>
        <h1 className="text-center mb-4">Sign-Up</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control rounded-0"
              name="name"
              onChange={handleInput}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              name="email"
              onChange={handleInput}
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              name="password"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              placeholder="Enter Your Phone Number"
              className="form-control rounded-0"
              name="phone"
              onChange={handleInput}
            />
            {errors.phone && (
              <span className="text-danger">{errors.phone}</span>
            )}
          </div>
          <Link to="/login" className="btn btn-default border mx-1">
            Login
          </Link>
          <button type="submit" className="btn btn-primary mx-1">
            Sign-Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
