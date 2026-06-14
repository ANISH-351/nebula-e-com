import React from "react";
import { useNavigate } from "react-router-dom";

function LoginPopup({ onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-sm mx-4 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-[#c5a46d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75A4.5 4.5 0 008 6.75v3.75M5.25 10.5h13.5A1.5 1.5 0 0120.25 12v7.5A1.5 1.5 0 0118.75 21H5.25a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-medium text-gray-900 mb-2">Login required</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Please log in to add items to your cart or wishlist.
        </p>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-full bg-[#c5a46d] hover:bg-[#b89552] text-white text-sm font-medium transition-colors mb-3"
        >
          Login to continue
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LoginPopup;