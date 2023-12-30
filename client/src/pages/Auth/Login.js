import React, { useState } from "react";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import validation from "../validation/LoginValidation";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
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
      if (err.email === "" && err.password === "") {
        axios
          .post("/api/v1/auth/login", values)
          .then((res) => {
            if (res?.data?.success) {
              setAuth({
                ...auth,
                name: res.data.name,
                phone: res.data.phone,
                user: res.data.email,
                token: res.data.token,
                user_role: res.data.user_role,
              });
              localStorage.setItem("auth", JSON.stringify(res.data));
              toast.success(res?.data?.msg, {
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
            } else {
              toast.warn("Invalid email or password", {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              // toast.error("Invalid email or password");
            }
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginBody">
      <ToastContainer />
      <div className="bg-white p-3 rounded w-25" style={{ minWidth: "250px" }}>
        <h1 className="text-center mb-4">Login</h1>
        <form action="" onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-success mx-1">
            Login
          </button>
          <Link to="/signup" className="btn btn-default border mx-1">
            Sign-Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
