import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Browse from "../pages/Browse";
import ProtectedRoute from "./ProtectedRoute";
import Profiles from "../pages/Profiles";
import RequireProfile from "./RequireProfile";

export default function AppRoutes({ user }) {
  return (
    <Routes>
      {/* Root: decide where to go */}
      <Route
        path="/"
        element={<Navigate to={user ? "/profiles" : "/login"} replace />}
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={user ? <Navigate to="/profiles" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/profiles" replace /> : <Signup />}
      />

      {/* Profiles: must be logged in */}
      <Route
        path="/profiles"
        element={
          <ProtectedRoute user={user}>
            <Profiles />
          </ProtectedRoute>
        }
      />

      {/* Browse: must be logged in AND must have selected a profile */}
      <Route
        path="/browse"
        element={
          <ProtectedRoute user={user}>
            <RequireProfile>
              <Browse />
            </RequireProfile>
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
