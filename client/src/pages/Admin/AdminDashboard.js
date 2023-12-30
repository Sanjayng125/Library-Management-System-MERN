import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import "../../styles/style.css";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  return (
    <>
      <div className="body">
        <div className="sideMenu">
          <AdminMenu />
        </div>
        <div className="main">
          <div className="card m-2 p-2">
            <h2>Hello {auth?.name}!</h2>
            <hr />
            <h4>Name: {auth?.name}</h4>
            <h4>Phone: {auth?.phone}</h4>
            <h4>Email: {auth?.user}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
