import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        // Verify token validity
        // if (decodedToken.exp * 1000 < Date.now()) {
        //   console.log("Invalid token");

        //   throw new Error("Token expired");
        // }

        // If the token is valid, set user and auth state
        setUser(decodedToken.sub);
        setIsAuthenticated(true);

        // If we're on the sign page with a valid token, redirect to home
        if (location.pathname.includes("/sign")) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setUser(null);

        // Only redirect to sign page if we're not already there
        if (!location.pathname.includes("/sign")) {
          navigate("/sign", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [location.pathname, navigate]);

  const login = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setIsAuthenticated(true);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/sign", { replace: true });
  };

  if (isLoading) {
    return null; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
