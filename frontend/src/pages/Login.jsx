import React, { useState } from "react";
import { useNavigate, Link, data } from "react-router-dom";
import  useAuth  from '../context/AuthContext';
import axios from "axios";
import { API } from '../api';

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      login(data);
      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#D5EDDB] flex">
      {/* Left side  */}
      <div className="hidden lg:flex p-12 justify-between w-1/2 flex-col relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold tracking-tight text-[#007E6E]">
              CHATBOX
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-[#007E6E] text-5xl font-bold leading-tight mb-4">
            Connect with <br />
            anyone, instantly.
          </h2>
          <p className="text-[#1e1e1e] text-lg leading-relaxed">
            Real-time messaging powered by Socket. Fast, secure  <br /> and always online.
          </p>
        </div>

        <div className="z-10 relative flex flex-col gap-3"></div>
      </div>
      {/* Right side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-white text-4xl font-bold">ChatBox</span>
          </div>
          <h1 className="text-[#007E6E] text-3xl mb-2 font-bold">
            Welcome Back
          </h1>
          <p className="text-[#1e1e1e] mb-8 opacity-80">
            Sign in to your account to continue
          </p>
          {/* Error */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 text-white text-md px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-gray-500 text-sm mb-2 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your Username..."
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key == "Enter" && handleSubmit(e)}
                className="w-full border-2 border-[#007E6E] placeholder-gray-600 px-4 py-3.5 outline-none rounded-lg transition text-md"
              />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password..."
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
                className="w-full border-2 border-[#007E6E] placeholder-gray-600 px-4 py-3.5 outline-none rounded-lg transition text-md"
              />
              <button onClick={handleSubmit} disabled={loading || !form.username || !form.password} className="w-full bg-[#007E6E] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-3.5 rounded-xl transition mt-6 flex items-center justify-center gap-2">
                {loading ? "Signing in" : "Sign in"}
              </button>
            </div>
            <p className="text-lg text-center mt-5">Don't have an account? {" "} 
              <Link className="text-[#008371c0] hover:text-[#007E6E] font-medium transition" to={'/register'}>Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
