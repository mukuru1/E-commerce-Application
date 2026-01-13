import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const storedUsers = localStorage.getItem("all_users");
        if (!storedUsers) {
          const res = await axios.get("/users?limit=0");
          if (res.data && res.data.users) {
            localStorage.setItem("all_users", JSON.stringify(res.data.users));
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchAllUsers();
  }, []);

 
  const login = async (username, password) => {
    setLoading(true);
    try {
      try {
       
        const res = await axios.post("/auth/login", {
          username,
          password,
          expiresInMins: 60,
        });

        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
          toast.success("Login successful!");
          try {
            window.dispatchEvent(new CustomEvent("user-login", { detail: { user: res.data } }));
          } catch (e) {}
          navigate("/dashboard");
          return;
        }
      } catch (apiErr) {
        console.warn("API login failed, checking local storage users...");
      }

      
      const storedUsers = JSON.parse(localStorage.getItem("all_users")) || [];
      const localUser = storedUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (localUser) {
        const token = `local-${Date.now()}`;
        localStorage.setItem("token", token);

        const userObj = { ...localUser, token };
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        toast.success("Login successful (from local storage)!");
        try {
          window.dispatchEvent(new CustomEvent("user-login", { detail: { user: userObj } }));
        } catch (e) {}
        navigate("/dashboard");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login");
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
    
    const dashboardData = localStorage.getItem("dashboardProducts");

   
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    
    if (dashboardData) {
      localStorage.setItem("dashboardProducts", dashboardData);
    }

    setUser(null);

    try {
      window.dispatchEvent(new Event("user-logout"));
    } catch (e) {}

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
