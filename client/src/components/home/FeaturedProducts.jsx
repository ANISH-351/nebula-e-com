import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../components/const";
import { addToCart, fetchCart, increaseQuantity, decreaseQuantity } from "../../components/features/cartSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../../components/features/wishlistSlice";

import "swiper/css";

function FeaturedProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_id = 1;

  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.cart);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartAnimating, setCartAnimating] = useState(null);

  useEffect(() => {
    axios
      .get(`${api}/featuredProducts`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isInWishlist = (product_id) =>
    wishlistItems.some((w) => w.product_id === product_id);

  // Returns the cart item object (or undefined) for a given product_id
  const getCartItem = (product_id) =>
    cartItems.find((c) => c.product_id === product_id);

  const handleWishlist = (e, product_id) => {
    e.stopPropagation();
    if (isInWishlist(product_id)) {
      const item = wishlistItems.find((w) => w.product_id === product_id);
      dispatch(removeFromWishlist(item.id)).then(() => dispatch(fetchWishlist(user_id)));
    } else {
      dispatch(addToWishlist({ user_id, product_id })).then(() => dispatch(fetchWishlist(user_id)));
    }
  };

  const handleAddToCart = (e, product_id) => {
    e.stopPropagation();
    dispatch(addToCart({ user_id, product_id })).then(() => {
      dispatch(fetchCart(user_id));
      setCartAnimating(product_id);
      setTimeout(() => setCartAnimating(null), 800);
    });
  };

  // Uses the cart row's `id` (not product_id) to hit PUT /increaseQuantity/:id
  const handleIncrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(increaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  // Uses the cart row's `id` — if qty is 1, decreasing removes the item (handled in slice/backend)
  const handleDecrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(decreaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        @keyframes cartBounce {
          0%   { transform: translateX(-50%) translateY(0); }
          30%  { transform: translateX(-50%) translateY(-8px); }
          60%  { transform: translateX(-50%) translateY(2px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
        .heart-pop { animation: heartPop 0.4s ease forwards; }
        .cart-bounce { animation: cartBounce 0.5s ease forwards; }

        /* Cart controls bar — hidden by default, shown on hover or when in cart */
        .cart-controls-overlay {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        /* When NOT in cart: hide until hover */
        .not-in-cart .cart-controls-overlay {
          opacity: 0;
          transform: translateX(-50%) translateY(8px);
        }
        .not-in-cart:hover .cart-controls-overlay {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        /* When IN cart: always visible */
        .in-cart .cart-controls-overlay {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* Quantity pill */
        .qty-pill {
          display: flex;
          align-items: center;
          gap: 0;
          background: white;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .qty-btn {
          width: 36px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 500;
          color: #b89552;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          line-height: 1;
        }
        .qty-btn:hover { background: #faf7f2; }
        .qty-value {
          min-width: 28px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* Go To Cart pill */
        .go-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          background: #1a1a1a;
          padding: 10px 18px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .go-to-cart-btn:hover { background: #000; }

        /* Add To Cart pill (before adding) */
        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          background: #c5a46d;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(197,164,109,0.35);
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .add-to-cart-btn:hover { background: #b89552; }

        /* ── Mobile cart controls: shown BELOW image+name+price ── */
        .mobile-cart-row {
          display: none;
        }
        @media (max-width: 639px) {
          /* Hide overlay on mobile */
          .cart-controls-overlay { display: none !important; }
          .mobile-cart-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
        }
      `}</style>

      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px]">

          {/* Heading */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 mt-3">
                Featured Products
              </h2>
            </div>
            <button className="hidden md:block border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
              View All
            </button>
          </div>

          {loading && (
            <div className="flex gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 rounded-[30px] bg-[#faf7f2] animate-pulse h-[380px]" />
              ))}
            </div>
          )}

          {!loading && (
            <Swiper
              spaceBetween={24}
              slidesPerView={4}
              breakpoints={{
                0: { slidesPerView: 1.2 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {products.map((product) => {
                const inWishlist = isInWishlist(product.id);
                const cartItem = getCartItem(product.id);
                const inCart = !!cartItem;

                return (
                  <SwiperSlide key={product.id}>
                    <div
                      onClick={() => navigate(`/product-detail/${product.id}`)}
                      className="group cursor-pointer"
                    >
                      {/* Image card */}
                      <div className={`relative overflow-hidden rounded-[30px] bg-[#faf7f2] ${inCart ? "in-cart" : "not-in-cart"}`}>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleWishlist(e, product.id)}
                          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
                        >
                          <FaHeart
                            size={18}
                            className={inWishlist ? "heart-pop" : ""}
                            style={{ color: inWishlist ? "#c5a46d" : "#d4bfa0", transition: "color 0.3s" }}
                          />
                        </button>

                        {/* Product Image */}
                        <div className="overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* ── Desktop/Tablet overlay controls ── */}
                        <div className={`cart-controls-overlay ${cartAnimating === product.id ? "cart-bounce" : ""}`}>
                          {inCart ? (
                            <>
                              {/* Go To Cart — left pill */}
                              <button
                                className="go-to-cart-btn"
                                onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}
                              >
                                <FiShoppingCart size={15} />
                                Go To Cart
                              </button>

                              {/* Quantity — right pill */}
                              <div className="qty-pill" onClick={(e) => e.stopPropagation()}>
                                <button
                                  className="qty-btn"
                                  onClick={(e) => handleDecrease(e, cartItem.id)}
                                >
                                  −
                                </button>
                                <span className="qty-value">{cartItem.quantity}</span>
                                <button
                                  className="qty-btn"
                                  onClick={(e) => handleIncrease(e, cartItem.id)}
                                >
                                  +
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              className="add-to-cart-btn"
                              onClick={(e) => handleAddToCart(e, product.id)}
                            >
                              <FiShoppingCart size={15} />
                              Add To Cart
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Product Details */}
                      <div className="pt-5">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-[#b89552] text-lg mt-2">
                          ₹{product.price}
                        </p>
                      </div>

                      {/* ── Mobile-only controls below name & price ── */}
                      <div className="mobile-cart-row" onClick={(e) => e.stopPropagation()}>
                        {inCart ? (
                          <>
                            <button
                              className="go-to-cart-btn"
                              style={{ fontSize: "13px", padding: "8px 14px" }}
                              onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}
                            >
                              <FiShoppingCart size={13} />
                              Go To Cart
                            </button>
                            <div className="qty-pill">
                              <button className="qty-btn" onClick={(e) => handleDecrease(e, cartItem.id)}>−</button>
                              <span className="qty-value">{cartItem.quantity}</span>
                              <button className="qty-btn" onClick={(e) => handleIncrease(e, cartItem.id)}>+</button>
                            </div>
                          </>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            style={{ fontSize: "13px", padding: "8px 16px", width: "100%" }}
                            onClick={(e) => handleAddToCart(e, product.id)}
                          >
                            <FiShoppingCart size={13} />
                            Add To Cart
                          </button>
                        )}
                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 flex justify-center md:hidden">
            <button className="border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
              View All
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

export default FeaturedProducts;