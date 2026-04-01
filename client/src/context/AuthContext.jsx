import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          try {
            await authAPI.getCurrentUser();
          } catch (error) {
            // Token expired
            logout();
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const registerUser = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, registerUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
