import React, { useEffect } from "react";
import { FiPlus, FiMinus, FiTrash2, FiArrowRight, FiTag, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, increaseQuantity, decreaseQuantity, removeFromCart } from "../../components/features/cartSlice";



function Cart() {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((s) => s.cart);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    dispatch(fetchCart(user_id));
  }, [dispatch]);

const handleIncrease = (cartItemId) => {
  dispatch(increaseQuantity(cartItemId));
};

const handleDecrease = (cartItemId) => {
  dispatch(decreaseQuantity(cartItemId));
};

const handleRemove = (cartItemId) => {
  dispatch(removeFromCart(cartItemId));
};

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  if (loading) {
    return (
      <section className="w-full bg-white py-10 lg:py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px]">
          <div className="mb-10">
            <div className="h-4 w-20 bg-[#faf7f2] animate-pulse rounded-full mb-3" />
            <div className="h-10 w-48 bg-[#faf7f2] animate-pulse rounded-full" />
          </div>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[180px] rounded-3xl bg-[#faf7f2] animate-pulse" />
              ))}
            </div>
            <div className="h-[400px] rounded-3xl bg-[#faf7f2] animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={32} className="text-[#b89552]" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 text-sm">Looks like you haven't added anything yet.</p>
          <Link to="/">
            <button className="bg-[#b89552] hover:bg-[#9e7f3e] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95">
              Continue Shopping
            </button>
          </Link>
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
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">

          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-5 bg-[#faf7f2] rounded-3xl p-5 transition-all"
              >
                {/* Image */}
                <div className="w-full sm:w-[150px] h-[180px] sm:h-[180px] rounded-2xl overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-serif text-gray-900 mt-1">{item.name}</h2>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-semibold text-[#b89552]">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-4 mt-5 flex-wrap">
                    {/* Qty */}
                    <div className="flex items-center rounded-full border border-[#e6dcc8] overflow-hidden">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        className="w-10 h-10 flex items-center justify-center text-[#b89552] hover:bg-white transition"
                        aria-label="Decrease"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.id)}
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
                        onClick={() => handleRemove(item.id)}
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

          {/* Order Summary */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-serif text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span className="text-gray-900 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
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

            <Link to="/">
              <button className="w-full border border-[#d9c4a0] hover:bg-white active:scale-[0.98] transition-all text-[#b89552] py-3.5 rounded-full mt-3 text-sm font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Cart;