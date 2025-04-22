import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import ShopContext from "./context/ShopContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouse";
import Inventory from "./pages/Inventory";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const { shop } = useContext(ShopContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={shop ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/warehouses" element={shop ? <Warehouses /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={shop ? <Inventory /> : <Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={shop ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/forgot-password"
            element={!shop ? <ForgotPassword /> : <Navigate to="/" />}
          />
          <Route
            path="/verify-otp/:email"
            element={!shop ? <VerifyOtp /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
