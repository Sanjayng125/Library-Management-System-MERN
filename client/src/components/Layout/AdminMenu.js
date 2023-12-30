import React from "react";
import "../../styles/style.css";
import { Link } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="sideBar">
        <h2 className="text-center">Admin Profile</h2>
        <ul style={{ padding: "0", listStyleType: "none" }}>
          <li>
            <Link
              to={"/dashboard/admin/book"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage Book
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/admin/category"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage Category
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/admin/users"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/admin/requests"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage Requests
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/admin/history"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Manage History
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/admin/issued"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Issued Books
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminMenu;
