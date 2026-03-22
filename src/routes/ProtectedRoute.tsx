import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { store } from "../store/store";
import { loginUser } from "../store/userSlice";
import type { RootState } from "../store/store";
import axios from "axios";
import LoadingIndicator from "../components/core/LoadingComponent";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(!accessToken);
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/auth/refreshAuth`, {
          withCredentials: true,
        })
        .then((res) => {
          store.dispatch(loginUser(res.data));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading)
    return (
      <div className="bg-gray-800">
        <LoadingIndicator placement="fullscreen" size="lg" />{" "}
      </div>
    );
  if (!accessToken)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default ProtectedRoute;
