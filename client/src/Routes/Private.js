import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
// import superagent from "superagent";
import axios from "axios";
import { Outlet } from "react-router";
import Spinner from "../components/Spinner";
// import dotenv from "dotenv";

// dotenv.config();

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      //using axios. don't forgot to use REACT_APP_API before api!!...
      const res = await axios.get(`/api/v1/auth/user-auth`);

      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
