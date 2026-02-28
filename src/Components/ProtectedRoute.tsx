import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../Redux/store";
import type { JSX } from "react";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;