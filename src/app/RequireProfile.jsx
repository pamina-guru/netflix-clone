import { Navigate, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function RequireProfile({ children }) {
  const { profile } = useProfile();
  const loc = useLocation();

  if (!profile) {
    return <Navigate to="/profiles" replace state={{ from: loc.pathname }} />;
  }

  return children;
}
