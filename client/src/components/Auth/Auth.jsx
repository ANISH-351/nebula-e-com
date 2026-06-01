import React, { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../components/const";

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    axios.post(`${api}/login`, form)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch((err) => {
        setServerError(err.response?.data || "Login failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  const inputClass = (field) =>
    `w-full bg-[#faf7f2] border rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-800 ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#e6dcc8] focus:border-[#b89552]"
    }`;

  return (
    <section className="w-full min-h-screen bg-white flex">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#faf7f2] flex-col justify-between p-12 relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">nebula</h1>
          <p className="mt-3 text-sm text-gray-400 max-w-xs leading-relaxed">
            Premium fashion and timeless essentials crafted for modern lifestyles.
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#b89552]/8" />
        <div className="absolute bottom-32 -right-16 w-64 h-64 rounded-full bg-[#b89552]/5" />

        <div>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Member Benefits</p>
          <div className="mt-4 space-y-3">
            {["Early access to new collections", "Exclusive member-only discounts", "Free shipping on all orders"].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b89552]" />
                <span className="text-sm text-gray-600">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <h1 className="lg:hidden text-2xl font-serif text-gray-900 mb-8">nebula</h1>

          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Welcome back</p>
          <h2 className="mt-2 text-[2rem] font-serif text-gray-900 leading-tight">Sign In</h2>
          <p className="mt-2 text-sm text-gray-400">Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-[#b89552] hover:underline font-medium">
              Sign up
            </button>
          </p>

          <div className="mt-8 space-y-4">

            {/* Email */}
            <div className="relative">
              <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass("password")}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#b89552] transition"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
              {errors.password && <p className="text-xs text-red-400 mt-1 pl-1">{errors.password}</p>}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-500">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] disabled:opacity-60 text-white py-4 rounded-full text-sm font-medium transition-all mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}


export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    axios.post(`${api}/signup`, { name: form.name, email: form.email, password: form.password })
      .then(() => navigate("/login"))
      .catch((err) => {
        setServerError(err.response?.data || "Signup failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  const inputClass = (field) =>
    `w-full bg-[#faf7f2] border rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-400 text-gray-800 ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#e6dcc8] focus:border-[#b89552]"
    }`;

  return (
    <section className="w-full min-h-screen bg-white flex">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#faf7f2] flex-col justify-between p-12 relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">nebula</h1>
          <p className="mt-3 text-sm text-gray-400 max-w-xs leading-relaxed">
            Join thousands of fashion-forward members enjoying exclusive access.
          </p>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#b89552]/8" />
        <div className="absolute bottom-32 -right-16 w-64 h-64 rounded-full bg-[#b89552]/5" />

        <div>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Why Join?</p>
          <div className="mt-4 space-y-3">
            {["Track your orders in real time", "Wishlist your favourite pieces", "Faster checkout every time"].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b89552]" />
                <span className="text-sm text-gray-600">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <h1 className="lg:hidden text-2xl font-serif text-gray-900 mb-8">nebula</h1>

          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Create account</p>
          <h2 className="mt-2 text-[2rem] font-serif text-gray-900 leading-tight">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-400">Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#b89552] hover:underline font-medium">
              Sign in
            </button>
          </p>

          <div className="mt-8 space-y-4">

            {/* Name */}
            <div className="relative">
              <FiUser size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1 pl-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass("password")}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#b89552] transition"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
              {errors.password && <p className="text-xs text-red-400 mt-1 pl-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="relative">
              <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className={inputClass("confirm")}
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#b89552] transition"
              >
                {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
              {errors.confirm && <p className="text-xs text-red-400 mt-1 pl-1">{errors.confirm}</p>}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-500">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] disabled:opacity-60 text-white py-4 rounded-full text-sm font-medium transition-all mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}