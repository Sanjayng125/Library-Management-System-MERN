import { useState } from "react";
import searchBooks from "./searchBooksContext";

const SearchProvider = (props) => {
  const [val, setVal] = useState([]);
  const [msg, setMsg] = useState("");
  return (
    <searchBooks.Provider value={{ val, setVal, msg, setMsg }}>
      {props.children}
    </searchBooks.Provider>
  );
};

export default SearchProvider;
