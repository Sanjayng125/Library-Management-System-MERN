import React from "react";
import SearchBar from "../SearchBar";
import { useAuth } from "../../context/auth";
import { Link, NavLink } from "react-router-dom";
// eslint-disable-next-line
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({
      name: null,
      phone: null,
      user: null,
      user_role: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged Out!", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a href="/" className="navbar-brand">
              📚 Library
            </a>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link" aria-current="page">
                  Home
                </Link>
              </li>
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/signup" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={`/dashboard/${
                        auth?.user_role === "admin" ? "admin" : "user"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="nav-link"
                    >
                      Logout
                    </NavLink>
                  </li>
                  {/* search bar is here before!! */}
                </>
              )}
              <li>
                <SearchBar />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
