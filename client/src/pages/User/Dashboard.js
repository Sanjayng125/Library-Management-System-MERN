import React from "react";
import { useAuth } from "../../context/auth";
import "../../styles/style.css";
import UserMenu from "../../components/Layout/UserMenu";

const Dashboard = () => {
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  return (
    <>
      <div className="body">
        <div className="sideMenu">
          <UserMenu />
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

export default Dashboard;
