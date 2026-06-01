import React, { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
} from "react-icons/fi";
import logo from "../../assets/home-images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../components/features/cartSlice";
import { fetchWishlist } from "../../components/features/wishlistSlice";
import axios from "axios";
import { api } from "../../components/const";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user_id = 1;

  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { categories } = useSelector((s) => s.category);

  // Search state
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef(null);

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
    }, 400); // 400ms debounce

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
    navigate(`/product/${id}`);
  };

  const SearchBox = ({ mobile }) => (
    <div className="w-full relative" ref={!mobile ? dropdownRef : null}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className={`w-full border border-[#e6dcc8] rounded-full ${
          mobile ? "py-2" : "py-3"
        } pl-5 pr-12 outline-none focus:border-[#c5a46d] text-sm`}
      />
      <FiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-[#b89552] text-lg" />

      {/* Dropdown */}
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

            {/* Categories from API */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to="/category"
                  className="text-gray-700 hover:text-[#c5a46d] transition"
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
          <div className="flex items-center gap-5 text-2xl text-[#b89552]">

            <Link to="/wishlist">
              <button className="hover:scale-110 transition relative">
                <FiHeart />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c5a46d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            </Link>

            <Link to="/cart">
              <button className="hover:scale-110 transition relative">
                <FiShoppingCart />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c5a46d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
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
        <div className="md:hidden" ref={dropdownRef}>
          <SearchBox mobile />
        </div>

      </div>
    </header>
  );
};

export default Header;