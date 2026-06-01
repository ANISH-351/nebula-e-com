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

function NewArrival() {
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
      .get(`${api}/newArrivals`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isInWishlist = (product_id) =>
    wishlistItems.some((w) => w.product_id === product_id);

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

  const handleIncrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(increaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  const handleDecrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(decreaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">

        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
             <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
              New Collections
          </span>
            <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 mt-3">
              New Arrivals
            </h2>
          </div>
          {/* <button className="hidden md:block border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
            View All
          </button> */}
        </div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="flex gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-[30px] bg-[#faf7f2] animate-pulse h-[380px]"
              />
            ))}
          </div>
        )}

        {/* Swiper */}
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
                    {/* Image Card */}
                    <div className="relative overflow-hidden rounded-[30px] bg-[#faf7f2]">

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlist(e, product.id)}
                        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110"
                      >
                        <FaHeart
                          size={18}
                          className={`transition-colors duration-300 ${
                            inWishlist ? "text-[#c5a46d]" : "text-[#d4bfa0]"
                          }`}
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

                      {/* Desktop / Tablet Cart Overlay */}
                      <div
                        className={`
                          absolute bottom-4 left-1/2 -translate-x-1/2
                          hidden sm:flex
                          items-center gap-2 whitespace-nowrap
                          transition-all duration-300
                          ${inCart
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                          }
                          ${cartAnimating === product.id ? "animate-bounce" : ""}
                        `}
                      >
                        {inCart ? (
                          <>
                            {/* Go To Cart */}
                            <button
                              className="flex items-center gap-1.5 text-white bg-[#1a1a1a] px-[18px] py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-black transition-colors"
                              onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}
                            >
                              <FiShoppingCart size={15} />
                              Go To Cart
                            </button>

                            {/* Quantity Pill */}
                            <div
                              className="flex items-center bg-white rounded-full shadow-lg overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-9 h-10 flex items-center justify-center text-lg font-medium text-[#b89552] bg-transparent border-none cursor-pointer hover:bg-[#faf7f2] transition-colors leading-none"
                                onClick={(e) => handleDecrease(e, cartItem.id)}
                              >
                                −
                              </button>
                              <span className="min-w-[28px] text-center text-[15px] font-semibold text-gray-900">
                                {cartItem.quantity}
                              </span>
                              <button
                                className="w-9 h-10 flex items-center justify-center text-lg font-medium text-[#b89552] bg-transparent border-none cursor-pointer hover:bg-[#faf7f2] transition-colors leading-none"
                                onClick={(e) => handleIncrease(e, cartItem.id)}
                              >
                                +
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            className="flex items-center gap-1.5 text-white bg-[#c5a46d] px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_4px_14px_rgba(197,164,109,0.35)] hover:bg-[#b89552] transition-colors"
                            onClick={(e) => handleAddToCart(e, product.id)}
                          >
                            <FiShoppingCart size={15} />
                            Add To Cart
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Product Info */}
                    <div className="pt-5">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-[#b89552] text-lg mt-2">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Mobile-only Controls */}
                    <div
                      className="flex sm:hidden items-center justify-between mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {inCart ? (
                        <>
                          <button
                            className="flex mb-2 items-center gap-1.5 text-white bg-[#1a1a1a] px-3.5 py-2 rounded-full text-[13px] font-medium shadow-lg hover:bg-black transition-colors"
                            onClick={(e) => { e.stopPropagation(); navigate("/cart"); }}
                          >
                            <FiShoppingCart size={13} />
                            Go To Cart
                          </button>
                          <div className="flex items-center mb-2 bg-white rounded-full shadow-lg overflow-hidden">
                            <button
                              className="w-8 h-9  flex items-center justify-center text-base font-medium text-[#b89552] bg-transparent border-none cursor-pointer hover:bg-[#faf7f2] transition-colors leading-none"
                              onClick={(e) => handleDecrease(e, cartItem.id)}
                            >
                              −
                            </button>
                            <span className="min-w-[24px] text-center text-sm font-semibold text-gray-900">
                              {cartItem.quantity}
                            </span>
                            <button
                              className="w-8 h-9  flex items-center justify-center text-base font-medium text-[#b89552] bg-transparent border-none cursor-pointer hover:bg-[#faf7f2] transition-colors leading-none"
                              onClick={(e) => handleIncrease(e, cartItem.id)}
                            >
                              +
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="flex mb-2 items-center justify-center gap-1.5 w-full text-white bg-[#c5a46d] px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#b89552] transition-colors"
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

        {/* Mobile View All */}
        {/* <div className="mt-8 flex justify-center md:hidden">
          <button className="border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
            View All
          </button> */}
        </div>

      </div>
    </section>
  );
}

export default NewArrival;