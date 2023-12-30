import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/User/Dashboard";
import PrivateRoute from "./Routes/Private";
import Header from "./components/Layout/Header";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PageNotFound from "./pages/PageNotFound";
import Book from "./pages/Admin/Book";
import Users from "./pages/Admin/Users";
// import UserAddBook from "./pages/User/UserAddBook";
// import MyBooks from "./pages/User/MyBooks";
import ManageIssueBooks from "./pages/User/ManageIssueBooks";
import Category from "./pages/Admin/Category";
import UpdateBook from "./pages/Admin/UpdateBook";
import ViewBookDetails from "./pages/Admin/ViewBookDetails";
import BookDetails from "./pages/BookDetails";
import Requests from "./pages/Admin/Requests";
import History from "./pages/Admin/History";
import IssuedBooks from "./pages/Admin/IssuedBooks";
import UpdateProfile from "./pages/User/UpdateProfile";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/book-details/:name" element={<BookDetails />} />
        <Route path="/search" element={<SearchPage />} />
        {/* User */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route
            path="user/manage-issue-books"
            element={<ManageIssueBooks />}
          />
          <Route path="user/updateProfile/:name" element={<UpdateProfile />} />
        </Route>
        {/* User */}
        {/* Admin */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/book" element={<Book />} />
          <Route path="admin/book/update-book/:name" element={<UpdateBook />} />
          <Route
            path="admin/book/book-details/:name"
            element={<ViewBookDetails />}
          />
          <Route path="admin/category" element={<Category />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/requests" element={<Requests />} />
          <Route path="admin/history" element={<History />} />
          <Route path="admin/issued" element={<IssuedBooks />} />
        </Route>
        {/* Admin */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
