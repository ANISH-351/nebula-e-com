import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../components/const";
import { addToCart } from "../../components/features/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../components/features/wishlistSlice";

import "swiper/css";

function FeaturedProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_id = 1;

  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.cart);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartAnimating, setCartAnimating] = useState(null); // product_id being animated

  useEffect(() => {
    axios.get(`${api}/featuredProducts`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isInWishlist = (product_id) =>
    wishlistItems.some((w) => w.product_id === product_id);

  const isInCart = (product_id) =>
    cartItems.some((c) => c.product_id === product_id);

  const handleWishlist = (e, product_id) => {
    e.stopPropagation();
    if (isInWishlist(product_id)) {
      const item = wishlistItems.find((w) => w.product_id === product_id);
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist({ user_id, product_id }));
    }
  };

  const handleCart = (e, product_id) => {
    e.stopPropagation();
    if (isInCart(product_id)) {
      navigate("/cart");
      return;
    }
    dispatch(addToCart({ user_id, product_id }));
    setCartAnimating(product_id);
    setTimeout(() => setCartAnimating(null), 800);
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
                const inCart = isInCart(product.id);

                return (
                  <SwiperSlide key={product.id}>
                    <div
                      onClick={() => navigate(`/product-detail/${product.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-[30px] bg-[#faf7f2]">

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleWishlist(e, product.id)}
                          className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-300
                            ${inWishlist
                              ? "bg-[#c5a46d] text-white scale-110"
                              : "bg-white text-[#b89552] hover:bg-[#c5a46d] hover:text-white hover:scale-110"
                            }`}
                        >
                          <FaHeart
                            size={18}
                            className={inWishlist ? "heart-pop" : ""}
                            style={{
                              transition: "color 0.3s, transform 0.3s",
                              color: inWishlist ? "white" : "#b89552",
                            }}
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

                        {/* Add To Cart / Go To Cart */}
                        <div
                          className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300
                            ${inCart
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                            }`}
                        >
                          <button
                            onClick={(e) => handleCart(e, product.id)}
                            className={`flex items-center gap-2 text-white px-6 py-3 rounded-full shadow-lg whitespace-nowrap transition-all duration-300
                              ${cartAnimating === product.id ? "cart-bounce" : ""}
                              ${inCart
                                ? "bg-gray-800 hover:bg-black"
                                : "bg-[#c5a46d] hover:bg-[#b89552]"
                              }`}
                          >
                            <FiShoppingCart />
                            {inCart ? "Go To Cart →" : "Add To Cart"}
                          </button>
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

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}

          {/* Mobile Button */}
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