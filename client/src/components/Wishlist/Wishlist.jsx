import React, { useEffect } from "react";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishlist, removeFromWishlist } from "../../components/features/wishlistSlice";
import { addToCart, fetchCart, increaseQuantity, decreaseQuantity } from "../../components/features/cartSlice";

const user_id = localStorage.getItem("user_id") || 1;

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems, loading } = useSelector((s) => s.wishlist);
  const { cartItems } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchWishlist(user_id));
    dispatch(fetchCart(user_id));
  }, [dispatch]);

  const getCartItem = (product_id) =>
    cartItems.find((c) => c.product_id === product_id);

  const handleRemoveWishlist = (wishlistId) => {
    dispatch(removeFromWishlist(wishlistId));
  };

  const handleAddToCart = (product_id) => {
    dispatch(addToCart({ user_id, product_id })).then(() =>
      dispatch(fetchCart(user_id))
    );
  };

  const handleIncrease = (cartItemId) => {
    dispatch(increaseQuantity(cartItemId));
  };

  const handleDecrease = (cartItemId) => {
    dispatch(decreaseQuantity(cartItemId));
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <section className="w-full bg-white min-h-screen py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-10 w-48 bg-[#faf7f2] animate-pulse rounded-full mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-[30px] bg-[#faf7f2] animate-pulse h-[480px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Empty state ──
  if (wishlistItems.length === 0) {
    return (
      <section className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto mb-6">
            <FiHeart size={32} className="text-[#b89552]" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8 text-sm">Save items you love and find them here.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#b89552] hover:bg-[#9e7f3e] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif text-gray-900">
            My Wishlist
            <span className="ml-3 text-lg font-sans font-normal text-gray-400">
              ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((product) => {
            const cartItem = getCartItem(product.product_id);
            const inCart = !!cartItem;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-[30px] overflow-hidden border border-[#f1e8db] hover:shadow-xl transition duration-300"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden bg-[#faf7f2] cursor-pointer"
                  onClick={() => navigate(`/product-detail/${product.product_id}`)}
                >
                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveWishlist(product.id); }}
                    className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#b89552] hover:bg-red-50 hover:text-red-400 transition"
                  >
                    <FiHeart size={18} className="fill-[#b89552]" />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="p-6">
                  <h2
                    className="text-2xl font-serif text-gray-900 mt-2 cursor-pointer hover:text-[#b89552] transition"
                    onClick={() => navigate(`/product-detail/${product.product_id}`)}
                  >
                    {product.name}
                  </h2>

                  <div className="flex items-center justify-between mt-5">
                    <p className="text-2xl font-semibold text-[#b89552]">₹{product.price}</p>

                    {/* Cart controls */}
                    {inCart ? (
                      <div className="flex items-center rounded-full border border-[#e6dcc8] overflow-hidden">
                        <button
                          onClick={() => handleDecrease(cartItem.id)}
                          className="w-9 h-10 flex items-center justify-center text-[#b89552] hover:bg-[#faf7f2] transition"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-semibold text-gray-900">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(cartItem.id)}
                          className="w-9 h-10 flex items-center justify-center text-[#b89552] hover:bg-[#faf7f2] transition"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product.product_id)}
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

      </div>
    </section>
  );
}

export default Wishlist;