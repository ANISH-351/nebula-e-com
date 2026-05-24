import React, { useState } from "react";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiStar, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";

import product1 from "../../assets/home-images/shirt.png";
import product2 from "../../assets/home-images/pant.png";
import product3 from "../../assets/home-images/pant.png";
import product4 from "../../assets/home-images/pant.png";

const SIZES = ["XS", "S", "M", "L", "XL"];

const PERKS = [
  { icon: <FiTruck size={16} />, label: "Free shipping" },
  { icon: <FiRefreshCw size={16} />, label: "7-day free returns" },
 
];

function ProductDetails() {
  const images = [product1, product2, product3, product4];

  const [mainImage, setMainImage] = useState(product1);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <section className="w-full bg-white py-10 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-[#f7f3ee] aspect-[4/5]">
              <img
                src={mainImage}
                alt="Product"
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Discount badge */}
              <span className="absolute top-4 left-4 text-[11px] tracking-widest uppercase bg-[#b89552] text-white px-3 py-1.5 rounded-full font-medium">
                26% off
              </span>
              {/* Wishlist icon on image */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition hover:bg-white"
                aria-label="Toggle wishlist"
              >
                <FiHeart
                  size={18}
                  className={wishlisted ? "fill-[#b89552] stroke-[#b89552]" : "stroke-gray-500"}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
                    mainImage === img
                      ? "border-[#b89552] scale-[0.97]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover bg-[#f7f3ee]"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col justify-center gap-0">

            {/* Category */}
            <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">
              Men's Collection
            </p>

            {/* Name */}
            <h1 className="mt-3 text-[2rem] sm:text-[2.5rem] font-serif text-gray-900 leading-tight">
              Premium Beige Shirt
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {Array(5).fill(null).map((_, i) => (
                  <FiStar key={i} size={14} className="fill-[#b89552] stroke-[#b89552]" />
                ))}
              </div>
              <span className="text-sm text-gray-400">4.9 · 128 reviews</span>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-gray-100" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[2rem] font-semibold text-[#b89552]">₹5999</span>
              <span className="text-lg text-gray-400 line-through">₹7999</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                Save ₹2000
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
              Crafted with premium cotton blend and tailored for timeless elegance — this shirt delivers
              comfort, luxury, and modern sophistication for any occasion.
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-gray-100" />

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase text-gray-400 font-medium">Select Size</p>
                
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

            {/* Divider */}
            <div className="my-5 h-px bg-gray-100" />

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Quantity */}
              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
                  aria-label="Decrease"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-[#b89552] hover:bg-[#fdf6ec] transition"
                  aria-label="Increase"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Add to cart */}
              <button className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] transition-all text-white text-sm font-medium px-6 py-3.5 rounded-full">
                <FiShoppingCart size={16} />
                Add to Cart
              </button>

              {/* Wishlist (desktop) */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted
                    ? "border-[#b89552] bg-amber-50"
                    : "border-gray-200 hover:border-[#b89552]"
                }`}
                aria-label="Wishlist"
              >
                <FiHeart
                  size={17}
                  className={wishlisted ? "fill-[#b89552] stroke-[#b89552]" : "stroke-gray-500"}
                />
              </button>
            </div>

            {/* Divider */}
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

            {/* Divider */}
            <div className="my-5 h-px bg-gray-100" />

            {/* Meta */}
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {[
                ["Category", "Men's Fashion"],
                ["Material", "Premium Cotton Blend"],
                ["Fit", "Regular Fit"],
                ["SKU", "MN-SHT-BGE-001"],
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
  );
}

export default ProductDetails;