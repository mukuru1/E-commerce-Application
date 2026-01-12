import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    try {
      
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const localUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (localUser) {
        const token = `local-${Date.now()}`;
        localStorage.setItem("token", token);
        const userObj = { username: localUser.username };
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        toast.success("Login successful (local)!");
        try {
          window.dispatchEvent(new CustomEvent("user-login", { detail: { user: userObj } }));
        } catch (e) {}
        navigate("/dashboard");
        return;
      }

      
      const res = await axios.post("/auth/login", {
        username,
        password,
        expiresInMins: 60,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Login successful!");
        try {
          window.dispatchEvent(new CustomEvent("user-login", { detail: { user: res.data.user } }));
        } catch (e) {}
        navigate("/dashboard"); 
      } else {
        toast.error("Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.username === username);
    if (exists) {
      toast.error("Username already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    const token = `local-${Date.now()}`;
    localStorage.setItem("token", token);
    const userObj = { username };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
    toast.success("Registered and logged in!");
    try {
      window.dispatchEvent(new CustomEvent("user-login", { detail: { user: userObj } }));
    } catch (e) {}
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    
    try {
      window.dispatchEvent(new Event("user-logout"));
    } catch (e) {
      
    }
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
