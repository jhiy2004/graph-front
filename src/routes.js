import { Routes, Route } from "react-router";
import DrawScreen from "./pages/DrawScreen/DrawScreen.js";
import UserGraphs from "./pages/UserGraphs/UserGraphs.js";
import LoginForm from "./pages/LoginForm/LoginForm.js";
import RegisterForm from "./pages/RegisterForm/RegisterForm.js";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/draw" element={<DrawScreen />} />
      <Route path="/user/graphs" element={<UserGraphs />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default AppRoutes;

