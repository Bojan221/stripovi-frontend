import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { store } from "../store/store";
import { loginUser, logoutUser } from "../store/userSlice";
import { showToast } from "../utils/toast";

export const axiosPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !prevRequest._retry &&
      !prevRequest.url.includes("/auth/refreshAuth")
    ) {
      prevRequest._retry = true;

      try {
        const res = await axiosPublic.get("/auth/refreshAuth", {
          withCredentials: true,
        });

        store.dispatch(loginUser(res.data));

        prevRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return axiosPrivate(prevRequest);
      } catch (err) {
        store.dispatch(logoutUser());
        showToast("error", "Sesija je istekla. Molim vas prijavite se ponovo.");
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
