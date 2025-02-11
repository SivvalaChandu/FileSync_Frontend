import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AddPost from "./components/AddPost";
import SignPage from "./components/SignPage";
import PublicPost from "./components/PublicPost";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const withAuth = (Component) => (
  <AuthProvider>
    <ProtectedRoute>{Component}</ProtectedRoute>
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withAuth(<App />),
  },
  {
    path: "/sign",
    element: (
      <AuthProvider>
        <SignPage />
      </AuthProvider>
    ),
  },
  {
    path: "/post",
    element: withAuth(<AddPost />),
  },
  {
    path: "/post/:id",
    element: withAuth(<AddPost />),
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/public",
    element: <PublicPost />,
  },
  {
    path: "/public/:id",
    element: <PublicPost />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
