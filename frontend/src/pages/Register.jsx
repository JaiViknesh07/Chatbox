import React, { useState } from "react";
import { useNavigate, Link, } from "react-router-dom";
import axios from "axios";
import { API } from '../api';
const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password should be atleast 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/register`, form);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
      console.log(error);
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
            Start chatting in <br />
            seconds
          </h2>
          <p className="text-[#1e1e1e] text-lg leading-relaxed">
            Create your free account and start your <br /> conversation
          </p>
        </div>

        <div className="z-10 relative flex flex-col gap-3"></div>
      </div>
      {/* Right side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-[#007E6E] text-4xl font-bold">ChatBox</span>
          </div>
          <h1 className="text-[#007E6E] text-3xl mb-2 font-bold">
            Create Account
          </h1>
          <p className="text-[#1e1e1e] mb-8 opacity-80">
            Free Forever. No credit card required
          </p>
          {/* Error */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 text-white text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter a Username..."
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
                className="w-full border-2 border-[#007E6E] placeholder-gray-600 px-4 py-3.5 outline-none rounded-lg transition text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Password must contain atleast 6 characters..."
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
                className="w-full border-2 border-[#007E6E] placeholder-gray-600 px-4 py-3.5 outline-none rounded-lg transition text-sm"
              />
              {/* Password Indicator */}
              <div className="flex gap-1 mt-0">
                {[1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 mt-5 mb-5 rounded-full transition-all duration-300 ${form.password.length === 0 ? "bg-[#007E6E]" : form.password.length < 6 ? (i === 1 ? "bg-red-500": "bg-[#007E6E]") : form.password.length < 10 ? (i <= 2 ? 'bg-yellow-500' : "bg-[#007E6E]") : "bg-green-500"}`}>
                    </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-5">
                {form.password.length === 0 ? "" : form.password.length < 6 ? "Weak Password" : form.password.length < 10 ? "Good passsword" : "Strong Password" }
              </p>
              <button onClick={handleSubmit} disabled={loading || !form.username || !form.password} className="w-full bg-[#007E6E] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-3.5 rounded-xl transition mt-2 flex items-center justify-center gap-2">
                {loading ? "Creating account" : "Create Account"}
              </button>
            </div>
            <p className="text-lg text-center mt-5">Already have an account? {" "} 
              <Link className="text-[#008371c0] hover:text-[#007E6E] font-medium transition" to={'/'}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
