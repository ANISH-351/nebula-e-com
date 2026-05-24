import React, { useState } from "react";
import { FiPlus, FiMinus, FiTrash2, FiArrowRight, FiTag, FiShoppingBag } from "react-icons/fi";

import shirt from "../../assets/home-images/shirt.png";
import pant from "../../assets/home-images/pant.png";
import { Link } from "react-router-dom";

const INITIAL_ITEMS = [
  { id: 1, name: "Premium Beige Shirt", category: "Men's Fashion", price: 8999, originalPrice: 120, size: "M", quantity: 1, image: shirt },
  { id: 2, name: "Classic Formal Pant", category: "Men's Fashion", price: 4120, originalPrice: 150, size: "L", quantity: 2, image: pant },
   { id: 1, name: "Premium Beige Shirt", category: "Men's Fashion", price: 8999, originalPrice: 120, size: "M", quantity: 1, image: shirt },
  { id: 2, name: "Classic Formal Pant", category: "Men's Fashion", price: 4120, originalPrice: 150, size: "L", quantity: 2, image: pant },
   { id: 1, name: "Premium Beige Shirt", category: "Men's Fashion", price: 8999, originalPrice: 120, size: "M", quantity: 1, image: shirt },
  { id: 2, name: "Classic Formal Pant", category: "Men's Fashion", price: 4120, originalPrice: 150, size: "L", quantity: 2, image: pant },
];

function Cart() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <section className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={32} className="text-[#b89552]" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 text-sm">Looks like you haven't added anything yet.</p>
          <button className="bg-[#b89552] hover:bg-[#9e7f3e] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95">
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-10 lg:py-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px]">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Shopping</p>
          <h1 className="text-[2rem] sm:text-[2.8rem] font-serif text-gray-900 mt-2 leading-tight">
            Your Cart
            <span className="ml-3 text-base font-sans font-normal text-gray-400 tracking-normal">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">

          {/* ── Cart Items ── */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-5 bg-[#faf7f2] rounded-3xl p-5 transition-all"
              >
                {/* Image */}
                <div className="w-full sm:w-[150px] h-[180px] sm:h-[180px] rounded-2xl overflow-hidden bg-white flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] tracking-[2.5px] uppercase text-[#b89552] font-medium">
                      {item.category}
                    </p>
                    <h2 className="text-xl font-serif text-gray-900 mt-1">{item.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">Size: {item.size}</p>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-semibold text-[#b89552]">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-4 mt-5 flex-wrap">
                    {/* Qty */}
                    <div className="flex items-center rounded-full border border-[#e6dcc8] overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center text-[#b89552] hover:bg-white transition"
                        aria-label="Decrease"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#b89552] hover:bg-white transition"
                        aria-label="Increase"
                      >
                        <FiPlus size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Item total */}
                      <span className="text-sm font-medium text-gray-500">
                        Subtotal:{" "}
                        <span className="text-gray-900 font-semibold">₹{item.price * item.quantity}</span>
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition"
                      >
                        <FiTrash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-serif text-gray-900">Order Summary</h2>

            {/* Line items */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span className="text-gray-900 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon (SAVE10)</span>
                  <span>−₹{discount}</span>
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="mt-6">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Promo Code</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[#e6dcc8] rounded-full px-4 py-2.5">
                  <FiTag size={13} className="text-[#b89552]" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={() => { if (coupon === "SAVE10") setCouponApplied(true); }}
                  className="bg-[#b89552] hover:bg-[#9e7f3e] active:scale-95 text-white text-xs font-medium px-4 rounded-full transition-all"
                >
                  Apply
                </button>
              </div>
              {coupon && coupon !== "SAVE10" && (
                <p className="text-xs text-red-400 mt-1.5 pl-2">Invalid code. Try SAVE10.</p>
              )}
            </div>

            {/* Divider + Total */}
            <div className="border-t border-[#e6dcc8] mt-6 pt-5 flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-[#b89552]">₹{total}</span>
            </div>

            {/* Checkout */}
            <Link to="/checkout" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] transition-all text-white py-4 rounded-full mt-6 text-sm font-medium">
              Proceed to Checkout
              <FiArrowRight size={16} />
            </button>
            </Link>

            <button className="w-full border border-[#d9c4a0] hover:bg-white active:scale-[0.98] transition-all text-[#b89552] py-3.5 rounded-full mt-3 text-sm font-medium">
              Continue Shopping
            </button>

          
          </div>

        </div>
      </div>
    </section>
  );
}

export default Cart;