import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiMapPin, FiLock, FiLogOut ,FiShoppingBag } from "react-icons/fi";

function ProfileSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="bg-[#faf7f2] rounded-[35px] p-6 h-fit">
      <h2 className="text-2xl font-serif mb-6">My Account</h2>

      <div className="space-y-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive ? "bg-[#c5a46d] text-white" : "hover:bg-white"
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
              isActive ? "bg-[#c5a46d] text-white" : "hover:bg-white"
            }`
          }
        >
          <FiMapPin />
          Address
        </NavLink>

         <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive ? "bg-[#c5a46d] text-white" : "hover:bg-white"
            }`
          }
        >
          <FiShoppingBag />
          My Orders
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-4 rounded-xl transition ${
              isActive ? "bg-[#c5a46d] text-white" : "hover:bg-white"
            }`
          }
        >
          <FiLock />
          Change Password
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-xl transition hover:bg-red-50 text-red-400 hover:text-red-500"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileSidebar;