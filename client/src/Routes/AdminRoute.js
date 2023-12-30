import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        //remember to set proxy int package.json to hit request to backend api i.g:"proxy":"http://localhost:8080"
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
