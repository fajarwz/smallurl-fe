import Dashboard from "./pages/user/dashboard";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";
import { history } from "./helpers/history";
import Register from "./pages/auth/register";

export default function MainRoutes() {
  return (
    <Routes history={history}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<Dashboard />} />
    </Routes>
  );
}
