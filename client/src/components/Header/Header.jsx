import React from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
} from "react-icons/fi";
import logo from "../../assets/home-images/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full shadow-xl bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px] py-4">
        <div className="flex items-center justify-between h-12 md:h-20 gap-4">
          
          {/* Left Section */}
          <div className="flex items-center gap-10">
            
            {/* Mobile Menu */}
            <button className="lg:hidden text-[#b89552] text-2xl">
              <FiMenu />
            </button>

            {/* Logo */}
            <Link to="/">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-[50px] mb-[20px] md:h-[80px] w-auto" />
              </div>
            </Link>

            {/* Categories */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/category"
                className="text-gray-700 hover:text-[#c5a46d] transition"
              >
                Men
              </Link>
              <Link
                to="/category"
                className="text-gray-700 hover:text-[#c5a46d] transition"
              >
                Women
              </Link>
            <Link
                to="/category"
                className="text-gray-700 hover:text-[#c5a46d] transition"
              >
                Accessories
              </Link>
              <Link
                to="/category"
                className="text-gray-700 hover:text-[#c5a46d] transition"
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-[#e6dcc8] rounded-full  py-3 pl-5 pr-12 outline-none focus:border-[#c5a46d] text-sm"
              />
              <FiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-[#b89552] text-lg" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 text-2xl text-[#b89552]">
            <Link
                to="/wishlist"
            >
              <button className="hover:scale-110 transition">
                <FiHeart />
              </button>
            </Link>

            <Link to="/cart">
              <button className="hover:scale-110 transition relative">
                <FiShoppingCart />
                <span className="absolute -top-2 -right-2 bg-[#c5a46d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </Link>

            <Link to="/profile">
              <button className="hover:scale-110 transition">
                <FiUser />
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden ">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-[#e6dcc8] rounded-full py-2 pl-5 pr-12 outline-none focus:border-[#c5a46d] text-sm"
            />
            <FiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-[#b89552] text-lg" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;