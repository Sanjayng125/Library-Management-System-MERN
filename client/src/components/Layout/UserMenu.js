import React from "react";
import "../../styles/style.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const UserMenu = () => {
  const [auth] = useAuth();
  return (
    <>
      <div className="sideBar">
        <h2>
          <Link to={""} style={{ textDecoration: "none", color: "white" }}>
            Profile
          </Link>
        </h2>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          <li>
            <Link
              to={"/dashboard/user/manage-issue-books"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage Issue Books
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/user/updateProfile/${auth?.name}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserMenu;
