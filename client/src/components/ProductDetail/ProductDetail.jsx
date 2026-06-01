import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiTruck, FiRefreshCw } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../components/const";
import { addToCart, fetchCart, increaseQuantity, decreaseQuantity } from "../../components/features/cartSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../../components/features/wishlistSlice";

const SIZES = ["XS", "S", "M", "L", "XL"];

const PERKS = [
  { icon: <FiTruck size={16} />, label: "Free shipping" },
  { icon: <FiRefreshCw size={16} />, label: "7-day free returns" },
];

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");

  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cartAnimating, setCartAnimating] = useState(false);

useEffect(() => {
  axios.get(`${api}/product_details/${id}`)
    .then((res) => {
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!data) {
        console.warn("Product not found for id:", id);
        setLoading(false);
        return;
      }
      setProduct(data);
      setMainImage(data.image);
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, [id]);

  const isInWishlist = wishlistItems.some((w) => w.product_id === Number(id));
  const cartItem = cartItems.find((c) => c.product_id === Number(id));
  const inCart = !!cartItem;

  const handleWishlist = () => {
    if (isInWishlist) {
      const item = wishlistItems.find((w) => w.product_id === Number(id));
      dispatch(removeFromWishlist(item.id)).then(() => dispatch(fetchWishlist(user_id)));
    } else {
      dispatch(addToWishlist({ user_id, product_id: Number(id) })).then(() =>
        dispatch(fetchWishlist(user_id))
      );
    }
  };

  const handleCart = () => {
    if (inCart) {
      navigate("/cart");
      return;
    }
    dispatch(addToCart({ user_id, product_id: Number(id), quantity })).then(() => {
      dispatch(fetchCart(user_id));
      setCartAnimating(true);
      setTimeout(() => setCartAnimating(false), 800);
    });
  };

  const handleIncrease = () => {
  dispatch(increaseQuantity(cartItem.id)).then(() => dispatch(fetchCart(user_id)));
};

const handleDecrease = () => {
  dispatch(decreaseQuantity(cartItem.id)).then(() => dispatch(fetchCart(user_id)));
};

  if (loading) {
    return (
      <section className="w-full bg-white py-10 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">
            <div className="rounded-3xl bg-[#faf7f2] animate-pulse aspect-[4/5]" />
            <div className="flex flex-col gap-4 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-5 bg-[#faf7f2] animate-pulse rounded-full ${i === 0 ? "w-24" : i === 1 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) return null;

  return (
    <>
      <style>{`
        @keyframes cartBounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.08); }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        .cart-bounce { animation: cartBounce 0.5s ease forwards; }
        .heart-pop   { animation: heartPop  0.4s ease forwards; }
      `}</style>

      <section className="w-full bg-white py-10 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">

            {/* ── Left: Images ── */}
            <div className="flex flex-col gap-4">

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden bg-[#f7f3ee] aspect-[4/5]">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Wishlist icon on image */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition hover:bg-white hover:scale-110"
                >
                  <FaHeart
                    size={16}
                    className={isInWishlist ? "heart-pop" : ""}
                    style={{
                      color: isInWishlist ? "#b89552" : "#d4bfa0",
                      transition: "color 0.3s",
                    }}
                  />
                </button>
              </div>

              {/* Single image — no thumbnails from API (only 1 image per product) */}
              {/* If you later add multiple images, map them here */}

            </div>

            {/* ── Right: Details ── */}
            <div className="flex flex-col justify-center gap-0">

              {/* Category */}
              <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">
                {product.category_name || "Collection"}
              </p>

              {/* Name */}
              <h1 className="mt-3 text-[2rem] sm:text-[2.5rem] font-serif text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating — static for now */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex gap-0.5">
                  {Array(5).fill(null).map((_, i) => (
                    <FiStar key={i} size={14} className="fill-[#b89552] stroke-[#b89552]" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">4.9 · 128 reviews</span>
              </div>

              <div className="my-5 h-px bg-gray-100" />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-[2rem] font-semibold text-[#b89552]">
                  ₹{product.price}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
                {product.description}
              </p>

              <div className="my-5 h-px bg-gray-100" />

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase text-gray-400 font-medium">
                    Select Size
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-11 h-11 rounded-full text-sm font-medium border transition-all duration-200 ${
                        selectedSize === s
                          ? "bg-[#b89552] border-[#b89552] text-white"
                          : "border-gray-200 text-gray-600 hover:border-[#b89552] hover:text-[#b89552]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-5 h-px bg-gray-100" />

            {/* Quantity + Add to Cart */}
<div className="flex flex-wrap items-center gap-3">

  {/* Quantity — show +/- controls on cart item if already in cart */}
  {inCart ? (
    <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
      <button
        onClick={handleDecrease}
        className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
      >
        <FiMinus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-gray-800">
        {cartItem.quantity}
      </span>
      <button
        onClick={handleIncrease}
        className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
      >
        <FiPlus size={14} />
      </button>
    </div>
  ) : (
    <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
      >
        <FiMinus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-gray-800">
        {quantity}
      </span>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
      >
        <FiPlus size={14} />
      </button>
    </div>
  )}

  {/* Add to cart / Go to cart */}
  <button
    onClick={handleCart}
    className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 text-white text-sm font-medium px-6 py-3.5 rounded-full transition-all
      ${cartAnimating ? "cart-bounce" : ""}
      bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98]`}
  >
    <FiShoppingCart size={16} />
    {inCart ? "Go To Cart →" : "Add to Cart"}
  </button>

  {/* Wishlist button */}
  <button
    onClick={handleWishlist}
    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 ${
      isInWishlist ? "border-[#b89552] bg-amber-50" : "border-gray-200 hover:border-[#b89552]"
    }`}
  >
    <FaHeart
      size={16}
      className={isInWishlist ? "heart-pop" : ""}
      style={{ color: isInWishlist ? "#b89552" : "#d4bfa0", transition: "color 0.3s" }}
    />
  </button>
</div>

              {/* Cart qty indicator */}
              {inCart && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[#b89552]">
                  <FiShoppingCart size={13} />
                  <span>{cartItem.quantity} item{cartItem.quantity > 1 ? "s" : ""} in cart</span>
                </div>
              )}

              <div className="my-5 h-px bg-gray-100" />

              {/* Perks */}
              <div className="flex flex-col gap-3">
                {PERKS.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="text-[#b89552]">{p.icon}</span>
                    {p.label}
                  </div>
                ))}
              </div>

              <div className="my-5 h-px bg-gray-100" />

              {/* Meta */}
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  ["Category", product.category_name || "—"],
                  ["Product ID", `#${product.id}`],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-700">{v}</span>
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetails;