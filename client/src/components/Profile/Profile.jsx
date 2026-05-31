import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import ProfileSidebar from "./ProfileSidebar";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Anish",
    phone: "9876543210",
    email: "anish@gmail.com",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);

    // API Call Here
    // axios.put(`/profile/${id}`, tempProfile);

    setEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditing(false);
  };

  return (
    <section className="py-10 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          <ProfileSidebar />

          <div className="bg-[#faf7f2] rounded-[35px] p-6 lg:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

              <div>
                <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
                  Account Details
                </span>

                <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mt-2">
                  Personal Information
                </h2>
              </div>

              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 border border-[#d9c4a0] text-[#b89552] px-5 py-3 rounded-full hover:bg-white transition"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">

                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 border border-gray-300 px-5 py-3 rounded-full hover:bg-white transition"
                  >
                    <FiX />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#c5a46d] hover:bg-[#b89552] text-white px-5 py-3 rounded-full transition"
                  >
                    <FiSave />
                    Save Changes
                  </button>

                </div>
              )}

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type="text"
                  name="name"
                  value={tempProfile.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e6dcc8] outline-none ${
                    editing
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type="text"
                  name="phone"
                  value={tempProfile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e6dcc8] outline-none ${
                    editing
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="relative md:col-span-2">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b89552]" />

                <input
                  type="email"
                  name="email"
                  value={tempProfile.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e6dcc8] outline-none ${
                    editing
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Profile;