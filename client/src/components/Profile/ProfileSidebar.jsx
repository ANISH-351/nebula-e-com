import { NavLink } from "react-router-dom";
import { FiUser, FiMapPin, FiLock } from "react-icons/fi";

function ProfileSidebar() {
  return (
    <div className="bg-[#faf7f2] rounded-[35px] p-6 h-fit">
      <h2 className="text-2xl font-serif mb-6">My Account</h2>

      <div className="space-y-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive
                ? "bg-[#c5a46d] text-white"
                : "hover:bg-white"
            }`
          }
        >
          <FiUser />
          Profile
        </NavLink>

        <NavLink
          to="/address"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive
                ? "bg-[#c5a46d] text-white"
                : "hover:bg-white"
            }`
          }
        >
          <FiMapPin />
          Address
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive
                ? "bg-[#c5a46d] text-white"
                : "hover:bg-white"
            }`
          }
        >
          <FiLock />
          Change Password
        </NavLink>
      </div>
    </div>
  );
}

export default ProfileSidebar;