import React, { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import logo from "../../assets/home-images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../components/features/cartSlice";
import { fetchWishlist } from "../../components/features/wishlistSlice";
import axios from "axios";
import { api } from "../../components/const";
import LoginPopup from "../../components/LoginPopup";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user_id = localStorage.getItem("user_id");

  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { categories } = useSelector((s) => s.category);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    dispatch(fetchCart(user_id));
    dispatch(fetchWishlist(user_id));
  }, [dispatch]);

  // Search with debounce
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await axios.get(`${api}/search?keyword=${keyword}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [keyword]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (id) => {
    setShowDropdown(false);
    setKeyword("");
    navigate(`/product-detail/${id}`);
  };

  const handleProtectedNav = (path) => {
    setMenuOpen(false);
    if (!user_id) {
      setShowLoginPopup(true);
      return;
    }
    navigate(path);
  };

  const SearchBox = ({ mobile }) => (
    <div className="w-full relative" ref={!mobile ? dropdownRef : null}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className={`w-full border border-[#e6dcc8] rounded-full ${
          mobile ? "py-2.5" : "py-3"
        } pl-5 pr-12 outline-none focus:border-[#c5a46d] text-sm bg-white`}
      />
      <FiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-[#b89552] text-lg" />

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border border-[#e6dcc8] rounded-2xl shadow-lg z-50 max-h-72 overflow-y-auto">
          {searching && (
            <p className="text-sm text-gray-400 px-4 py-3">Searching...</p>
          )}
          {!searching && results.length === 0 && (
            <p className="text-sm text-gray-400 px-4 py-3">No products found</p>
          )}
          {!searching &&
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item.id)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8f0] cursor-pointer transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg border border-[#e6dcc8]"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-[#c5a46d]">₹{item.price}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  // Animated hamburger icon — 3 bars morph to X
  const HamburgerIcon = () => (
    <button
      onClick={() => setMenuOpen((prev) => !prev)}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] focus:outline-none"
    >
      <span
        className={`block h-[2px] bg-[#b89552] rounded-full transition-all duration-300 origin-center ${
          menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"
        }`}
      />
      <span
        className={`block h-[2px] bg-[#b89552] rounded-full transition-all duration-300 ${
          menuOpen ? "w-0 opacity-0" : "w-4"
        }`}
      />
      <span
        className={`block h-[2px] bg-[#b89552] rounded-full transition-all duration-300 origin-center ${
          menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-6"
        }`}
      />
    </button>
  );

  return (
    <>
      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[78vw] max-w-[320px] bg-white z-50 lg:hidden
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e8d8]">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Mobile Search inside drawer */}
        {/* <div className="px-5 pt-4 pb-2" ref={dropdownRef}>
          <SearchBox mobile />
        </div> */}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-5 pt-2 pb-6">
          <p className="text-[10px] tracking-[2px] uppercase text-[#b89552] font-semibold mt-4 mb-2">
            Categories
          </p>
          <ul className="space-y-1">
            {categories.map((cat, idx) => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 rounded-xl text-gray-700 hover:text-[#b89552] hover:bg-[#fdf6ec] transition text-sm font-medium"
                >
                  {cat.name}
                  <span className="text-[#e6dcc8] text-xs">›</span>
                </Link>
                {idx < categories.length - 1 && (
                  <div className="h-px bg-[#f5efe4] mx-3" />
                )}
              </li>
            ))}
          </ul>

          <p className="text-[10px] tracking-[2px] uppercase text-[#b89552] font-semibold mt-6 mb-2">
            Account
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleProtectedNav("/wishlist")}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-[#b89552] hover:bg-[#fdf6ec] transition text-sm font-medium text-left"
              >
                <FiHeart size={15} className="text-[#b89552]" />
                Wishlist
                {wishlistItems?.length > 0 && (
                  <span className="ml-auto text-xs bg-[#fdf6ec] text-[#b89552] border border-[#e6dcc8] px-2 py-0.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            </li>
            <div className="h-px bg-[#f5efe4] mx-3" />
            <li>
              <button
                onClick={() => handleProtectedNav("/cart")}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-[#b89552] hover:bg-[#fdf6ec] transition text-sm font-medium text-left"
              >
                <FiShoppingCart size={15} className="text-[#b89552]" />
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-auto text-xs bg-[#b89552] text-white px-2 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </li>
            <div className="h-px bg-[#f5efe4] mx-3" />
            <li>
              <Link
                to={user_id ? "/profile" : "/signup"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-[#b89552] hover:bg-[#fdf6ec] transition text-sm font-medium"
              >
                <FiUser size={15} className="text-[#b89552]" />
                {user_id ? "My Profile" : "Sign In / Register"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-[#f0e8d8]">
          <p className="text-xs text-gray-400 text-center">© Nebula. All rights reserved.</p>
        </div>
      </aside>

      {/* Main Header */}
      <header className="w-full shadow-xl bg-white sticky top-0 z-40">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-4">
          <div className="flex items-center justify-between h-12 md:h-20 gap-4">

            {/* Left: Hamburger + Logo + Desktop Nav */}
            <div className="flex items-center gap-4 lg:gap-10">
              <HamburgerIcon />

              <Link to="/">
                <img src={logo} alt="Logo" className="h-[44px] md:h-[70px] w-auto" />
              </Link>

              <nav className="hidden lg:flex items-center gap-8">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="text-gray-700 hover:text-[#c5a46d] transition text-sm font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBox />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 text-xl text-[#b89552]">
              <button
                onClick={() => handleProtectedNav("/wishlist")}
                className="hover:scale-110 transition relative"
                aria-label="Wishlist"
              >
                <FiHeart />
                {/* {wishlistItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c5a46d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )} */}
              </button>

              <button
                onClick={() => handleProtectedNav("/cart")}
                className="hover:scale-110 transition relative"
                aria-label="Cart"
              >
                <FiShoppingCart />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c5a46d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <Link to={user_id ? "/profile" : "/signup"} aria-label="Profile">
                <button className="hover:scale-110 transition">
                  <FiUser />
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (below header row) */}
          <div className="md:hidden mt-3" ref={dropdownRef}>
            <SearchBox mobile />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;