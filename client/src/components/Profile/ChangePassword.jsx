import React, { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import ProfileSidebar from "./ProfileSidebar";

function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="py-10 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          <ProfileSidebar />

          <div className="bg-[#faf7f2] rounded-[35px] p-6 lg:p-8">

            <div className="mb-8">
              <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
                Security
              </span>

              <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mt-2">
                Change Password
              </h2>
            </div>

            <div className="max-w-2xl space-y-5">

              {/* Current Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Current Password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#e6dcc8] bg-white outline-none focus:border-[#c5a46d]"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b89552]"
                >
                  {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#e6dcc8] bg-white outline-none focus:border-[#c5a46d]"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b89552]"
                >
                  {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#e6dcc8] bg-white outline-none focus:border-[#c5a46d]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b89552]"
                >
                  {showConfirm ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              <button className="bg-[#c5a46d] hover:bg-[#b89552] transition text-white px-8 py-3 rounded-full">
                Update Password
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ChangePassword;