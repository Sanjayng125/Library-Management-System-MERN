import { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    name: null,
    phone: null,
    user: null,
    user_role: null,
    token: "",
  });

  //Default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        name: parseData.name,
        phone: parseData.phone,
        user: parseData.email,
        user_role: parseData.user_role,
        token: parseData.token,
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
