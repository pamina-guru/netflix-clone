import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Browse from "../pages/Browse";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/browse" replace />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/browse" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/browse" replace /> : <Signup />}
      />

      <Route
        path="/browse"
        element={
          <ProtectedRoute user={user}>
            <Browse />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
