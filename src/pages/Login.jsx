import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please provide username and password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    
    register(username, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md px-4">
        <form
          onSubmit={isRegister ? handleRegister : handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-600">
              {isRegister ? "Sign up to get started" : "Login to continue"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-slate-700 font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-4 py-3 rounded-lg transition-all duration-200 shadow-md"
          >
            {isRegister ? "Create Account" : "Login"}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
