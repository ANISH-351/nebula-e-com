import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiMapPin, FiCreditCard, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../components/const";

const STATUS_COLORS = {
  confirmed: "bg-green-50 text-green-600",
  pending:   "bg-yellow-50 text-yellow-600",
  cancelled: "bg-red-50 text-red-500",
  delivered: "bg-blue-50 text-blue-600",
};

export default function Orders() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios.get(`${api}/getOrders/${user_id}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

  // ── Skeleton ──
  if (loading) {
    return (
      <section className="w-full bg-white min-h-screen py-10 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="h-10 w-40 bg-[#faf7f2] animate-pulse rounded-full mb-10" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 rounded-3xl bg-[#faf7f2] animate-pulse mb-4" />
          ))}
        </div>
      </section>
    );
  }

  // ── Empty ──
  if (orders.length === 0) {
    return (
      <section className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={32} className="text-[#b89552]" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-3">No orders yet</h2>
          <p className="text-gray-400 mb-8 text-sm">Looks like you haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#b89552] hover:bg-[#9e7f3e] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Account</p>
          <h1 className="mt-2 text-[2rem] sm:text-[2.5rem] font-serif text-gray-900 leading-tight">
            My Orders
            <span className="ml-3 text-base font-sans font-normal text-gray-400">
              ({orders.length} {orders.length === 1 ? "order" : "orders"})
            </span>
          </h1>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-[#faf7f2] rounded-3xl overflow-hidden border border-[#f0e6d3]"
            >
              {/* Order header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 cursor-pointer"
                onClick={() => toggleExpand(order.order_id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FiShoppingBag size={18} className="text-[#b89552]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Order #{order.order_id}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                      <span className="font-semibold text-gray-700">₹{order.total_amount}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                    {order.status}
                  </span>
                  <button className="text-gray-400 hover:text-[#b89552] transition">
                    {expanded[order.order_id] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expanded[order.order_id] && (
                <div className="border-t border-[#e8d9c4] px-6 pb-6 pt-5 space-y-5">

                  {/* Items */}
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Items</p>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => navigate(`/product-detail/${item.product_id}`)}
                        >
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-[#eddfc8]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate hover:text-[#b89552] transition">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin size={13} className="text-[#b89552]" />
                      <p className="text-xs tracking-widest uppercase text-gray-400">Delivery Address</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{order.full_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.address_line}, {order.city}, {order.state} — {order.pincode}, {order.country}
                    </p>
                  </div>

                  {/* Payment info */}
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiCreditCard size={13} className="text-[#b89552]" />
                      <p className="text-xs tracking-widest uppercase text-gray-400">Payment</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        ["Payment ID", order.payment_id],
                        ["Total Paid", `₹${order.total_amount}`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-gray-400">{label}</span>
                          <span className="font-medium text-gray-800 max-w-[55%] truncate text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}