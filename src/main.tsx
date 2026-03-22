import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import MyCollectionPage from "./pages/MyCollectionPage.tsx";
import MyListPage from "./pages/MyListPage.tsx";
import MyAccountPage from "./pages/MyAccountPage.tsx";
import StatisticPage from "./pages/StatisticPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import AdminUserPage from "./pages/admin/AdminUserPage.tsx";
import PublisherPage from "./pages/admin/PublisherPage.tsx";
import EditionsPage from "./pages/admin/EditionsPage.tsx";
import CharactersPage from "./pages/admin/CharactersPage.tsx";
import ComicsPage from "./pages/admin/ComicsPage.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/my-collection",
        element: <MyCollectionPage />,
      },
      {
        path: "/my-list",
        element: <MyListPage />,
      },
      {
        path: "/my-account",
        element: <MyAccountPage />,
      },
      {
        path: "/statistic",
        element: <StatisticPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
        children: [
          {
            index: true,
            element: <Navigate to="users" replace />,
          },
          {
            path: "users",
            element: <AdminUserPage />,
          },
          {
            path: "publisher",
            element: <PublisherPage />,
          },
          {
            path: "editions",
            element: <EditionsPage />,
          },
          {
            path: "characters",
            element: <CharactersPage />,
          },
          {
            path: "comics",
            element: <ComicsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </Provider>
  </StrictMode>,
);
