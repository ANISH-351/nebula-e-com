import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiFilter, FiMinus, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart, increaseQuantity, decreaseQuantity } from "../../components/features/cartSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../../components/features/wishlistSlice";
import { fetchCategories } from "../../components/features/categorySlice";
import axios from "axios";
import { api } from "../../components/const";

function CategoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const user_id = localStorage.getItem("user_id") || 1;

  const { wishlistItems } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.cart);
  const { categories } = useSelector((s) => s.category);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");

  const currentCategory = categories.find((c) => c.id === Number(id));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    const url = id ? `${api}/product/${id}` : `${api}/product`;
    axios.get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
    dispatch(addToCart({ user_id, product_id })).then(() => dispatch(fetchCart(user_id)));
  };

  const handleIncrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(increaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  const handleDecrease = (e, cartItemId) => {
    e.stopPropagation();
    dispatch(decreaseQuantity(cartItemId)).then(() => dispatch(fetchCart(user_id)));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "low")  return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    if (sortBy === "new")  return b.id - a.id;
    return 0;
  });

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease forwards; }
      `}</style>

      <section className="w-full bg-white min-h-screen py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
                Premium Collection
              </span>
              <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mt-4">
                {currentCategory ? currentCategory.name : "All Products"}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                {products.length} products
              </p>
            </div>

            <div className="flex items-center gap-3 border border-[#e6dcc8] rounded-full px-5 py-3 w-fit">
              <FiFilter className="text-[#b89552]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="outline-none bg-transparent text-gray-600"
              >
                <option value="">Sort By</option>
                <option value="new">Newest</option>
                <option value="low">Price Low To High</option>
                <option value="high">Price High To Low</option>
              </select>
            </div>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[30px] overflow-hidden border border-[#f1e8db]">
                  <div className="h-[380px] bg-[#faf7f2] animate-pulse" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-3 w-20 bg-[#faf7f2] animate-pulse rounded-full" />
                    <div className="h-5 w-3/4 bg-[#faf7f2] animate-pulse rounded-full" />
                    <div className="h-4 w-1/2 bg-[#faf7f2] animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && sortedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-lg">No products found</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => {
                const inWishlist = isInWishlist(product.id);
                const cartItem = getCartItem(product.id);
                const inCart = !!cartItem;

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product-detail/${product.id}`)}
                    className="group bg-white rounded-[30px] overflow-hidden border border-[#f1e8db] hover:shadow-xl transition duration-300 cursor-pointer"
                  >

                    {/* Image */}
                    <div className="relative overflow-hidden bg-[#faf7f2]">

                      {/* Wishlist */}
                      <button
                        onClick={(e) => handleWishlist(e, product.id)}
                        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center transition hover:scale-110"
                      >
                        <FaHeart
                          size={18}
                          className={inWishlist ? "heart-pop" : ""}
                          style={{
                            color: inWishlist ? "#c5a46d" : "#d4bfa0",
                            transition: "color 0.3s",
                          }}
                        />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <span className="text-sm uppercase tracking-[3px] text-[#c5a46d]">
                        {product.category_name}
                      </span>

                      <h2 className="text-2xl font-serif text-gray-900 mt-2">
                        {product.name}
                      </h2>

                      <div className="flex items-center justify-between mt-5">
                        <p className="text-2xl font-semibold text-[#b89552]">
                          ₹{product.price}
                        </p>

                        {/* Cart controls */}
                        {inCart ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center rounded-full border border-[#e6dcc8] overflow-hidden"
                          >
                            <button
                              onClick={(e) => handleDecrease(e, cartItem.id)}
                              className="w-9 h-10 flex items-center justify-center text-[#b89552] hover:bg-[#faf7f2] transition"
                            >
                              <FiMinus size={13} />
                            </button>
                            <span className="min-w-[28px] text-center text-sm font-semibold text-gray-900">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={(e) => handleIncrease(e, cartItem.id)}
                              className="w-9 h-10 flex items-center justify-center text-[#b89552] hover:bg-[#faf7f2] transition"
                            >
                              <FiPlus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            className="flex items-center gap-2 border border-[#d9c4a0] hover:bg-[#c5a46d] hover:text-white hover:border-[#c5a46d] transition text-[#b89552] px-5 py-2 rounded-full text-sm"
                          >
                            <FiShoppingCart size={14} />
                            Add To Cart
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default CategoryPage;