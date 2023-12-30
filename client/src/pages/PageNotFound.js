import React from "react";
import { Link } from "react-router-dom";
import "../styles/pnf.css";

const PageNotFound = () => {
  return (
    <>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h3 className="pnf-heading">Oops! Page Not Found</h3>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;
