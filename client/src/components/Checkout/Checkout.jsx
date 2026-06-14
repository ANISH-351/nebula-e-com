import React, { useState, useEffect } from "react";
import { FiTruck, FiPlus, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../components/const";

const EMPTY_FORM = {
  full_name: "", phone: "", pincode: "", city: "",
  state: "", country: "", address_line: ""
};

export default function Checkout() {
  const navigate = useNavigate();
  const user_id = parseInt(localStorage.getItem("user_id"));
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const { cartItems } = useSelector((s) => s.cart);
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [addrLoading, setAddrLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    setAddrLoading(true);
    axios.get(`${api}/getAddress/${user_id}`)
      .then((res) => {
        setAddresses(res.data);
        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setAddrLoading(false));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())    e.full_name    = "Required";
    if (!form.phone.trim())        e.phone        = "Required";
    if (!form.pincode.trim())      e.pincode      = "Required";
    if (!form.city.trim())         e.city         = "Required";
    if (!form.state.trim())        e.state        = "Required";
    if (!form.country.trim())      e.country      = "Required";
    if (!form.address_line.trim()) e.address_line = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd    = () => { setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true); };
  const cancelForm = () => { setShowForm(false); setEditingId(null); setErrors({}); };

  const openEdit = (addr) => {
    setForm({
      full_name: addr.full_name, phone: addr.phone, pincode: addr.pincode,
      city: addr.city, state: addr.state, country: addr.country, address_line: addr.address_line
    });
    setEditingId(addr.id); setErrors({}); setShowForm(true);
  };

  const saveAddress = () => {
    if (!validate()) return;
    if (editingId) {
      axios.put(`${api}/updateAddress/${editingId}`, form)
        .then(() => { fetchAddresses(); setShowForm(false); setEditingId(null); })
        .catch((err) => console.error(err));
    } else {
      axios.post(`${api}/addAddress`, { ...form, user_id })
        .then(() => { fetchAddresses(); setShowForm(false); })
        .catch((err) => console.error(err));
    }
  };

  const removeAddress = (id) => {
    axios.delete(`${api}/deleteAddress/${id}`)
      .then(() => {
        const remaining = addresses.filter((a) => a.id !== id);
        setAddresses(remaining);
        if (selectedId === id) setSelectedId(remaining[0]?.id || null);
      })
      .catch((err) => console.error(err));
  };

  // ── Razorpay ──
  const handlePlaceOrder = async () => {
    if (!selectedId || cartItems.length === 0) return;

    setPayLoading(true);
    try {
      const { data: order } = await axios.post(`${api}/createOrder`, {
        amount: subtotal,
      });

      const options = {
        key: "rzp_test_T1AUwBTDCFooHr",
        amount: order.amount,
        currency: "INR",
        name: "Nebula",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(`${api}/verifyPayment`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });

            if (data.success) {
              await axios.post(`${api}/placeOrder`, {
                user_id,
                address_id:        selectedId,
                payment_id:        response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                total_amount:      subtotal,
                items: cartItems.map((i) => ({
                  product_id: i.product_id,
                  quantity:   i.quantity,
                  price:      i.price,
                })),
              });

              navigate("/order-success", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId:   response.razorpay_order_id,
                  amount:    subtotal,
                }
              });
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Verification error. Please contact support.");
          }
        },
        prefill: {
          name:    user?.name  || "",
          email:   user?.email || "",
          contact: addresses.find((a) => a.id === selectedId)?.phone || "",
        },
        notes: {
          address_id: selectedId,
          user_id,
        },
        theme: {
          color: "#b89552",
        },
        modal: {
          ondismiss: () => setPayLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setPayLoading(false);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Could not initiate payment. Try again.");
      setPayLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-white border rounded-2xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-400 ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#e6dcc8] focus:border-[#b89552]"
    }`;

  return (
    // FIX: overflow-x-hidden on the root prevents any child from causing horizontal scroll
    <section className="w-full bg-white py-10 lg:py-16 min-h-screen overflow-x-hidden">
      {/* FIX: removed large fixed px values on mobile; use px-4 as base and scale up */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">

        {/* Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Secure Checkout</p>
          <h1 className="text-3xl sm:text-[2.6rem] font-serif text-gray-900 mt-2 leading-tight">Checkout</h1>
        </div>

        {/* FIX: grid stacks to single column on mobile, side-by-side only on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 xl:gap-12 items-start">

          {/* Shipping Address */}
          <div className="bg-[#faf7f2] rounded-3xl p-5 sm:p-8 min-w-0">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#b89552]/10 flex items-center justify-center flex-shrink-0">
                  <FiTruck size={16} className="text-[#b89552]" />
                </div>
                {/* FIX: truncate prevents long text from pushing layout */}
                <h2 className="text-lg sm:text-xl font-serif text-gray-900 truncate">Shipping Address</h2>
              </div>
              {!showForm && (
                <button
                  onClick={openAdd}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#b89552] border border-[#d9c4a0] px-3.5 py-2 rounded-full hover:bg-white transition ml-2"
                >
                  <FiPlus size={13} /> Add New
                </button>
              )}
            </div>

            {/* Address list */}
            {!showForm && (
              <div className="space-y-3">
                {addrLoading && (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/60 animate-pulse" />
                  ))
                )}

                {!addrLoading && addresses.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No saved addresses. Add one above.
                  </p>
                )}

                {!addrLoading && addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedId(addr.id)}
                    className={`flex items-start gap-3 cursor-pointer rounded-2xl border p-4 transition-all ${
                      selectedId === addr.id
                        ? "border-[#b89552] bg-white"
                        : "border-transparent bg-white/50 hover:bg-white hover:border-[#e6dcc8]"
                    }`}
                  >
                    {/* Radio dot */}
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      selectedId === addr.id ? "border-[#b89552]" : "border-gray-300"
                    }`}>
                      {selectedId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#b89552]" />}
                    </div>

                    {/* Info — FIX: min-w-0 + overflow-hidden ensures text wraps instead of overflowing */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 truncate">{addr.full_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{addr.phone}</p>
                      {/* FIX: break-words on address text to prevent long strings overflowing */}
                      <p className="text-xs text-gray-500 mt-0.5 break-words">{addr.address_line}, {addr.city}</p>
                      <p className="text-xs text-gray-500 break-words">{addr.state}, {addr.pincode}, {addr.country}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(addr)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#b89552] hover:bg-[#fdf6ec] transition"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add / Edit form */}
            {showForm && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">
                  {editingId ? "Edit Address" : "New Address"}
                </p>
                {/* FIX: single column on mobile, 2-col on md+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input type="text" placeholder="Full Name" value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className={inputClass("full_name")} />
                    {errors.full_name && <p className="text-xs text-red-400 mt-1 pl-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Phone Number" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass("phone")} />
                    {errors.phone && <p className="text-xs text-red-400 mt-1 pl-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <input type="text" placeholder="Address Line" value={form.address_line}
                      onChange={(e) => setForm({ ...form, address_line: e.target.value })}
                      className={inputClass("address_line")} />
                    {errors.address_line && <p className="text-xs text-red-400 mt-1 pl-1">{errors.address_line}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="City" value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass("city")} />
                    {errors.city && <p className="text-xs text-red-400 mt-1 pl-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="State" value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={inputClass("state")} />
                    {errors.state && <p className="text-xs text-red-400 mt-1 pl-1">{errors.state}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Pincode" value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className={inputClass("pincode")} />
                    {errors.pincode && <p className="text-xs text-red-400 mt-1 pl-1">{errors.pincode}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Country" value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className={inputClass("country")} />
                    {errors.country && <p className="text-xs text-red-400 mt-1 pl-1">{errors.country}</p>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button onClick={saveAddress}
                    className="flex-1 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] text-white text-sm font-medium py-3 rounded-full transition-all">
                    {editingId ? "Save Changes" : "Save Address"}
                  </button>
                  <button onClick={cancelForm}
                    className="flex-1 border border-[#d9c4a0] hover:bg-white text-[#b89552] text-sm font-medium py-3 rounded-full transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary — FIX: min-w-0 prevents it from stretching beyond its column */}
          <div className="bg-[#faf7f2] rounded-3xl p-5 sm:p-8 min-w-0 lg:sticky lg:top-24">
            <h2 className="text-2xl font-serif text-gray-900">Order Summary</h2>

            {/* Cart items */}
            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  {/* FIX: min-w-0 so text truncates instead of overflowing */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e6dcc8] mt-5 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-[#e6dcc8] mt-4 pt-4 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-[#b89552]">₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedId || cartItems.length === 0 || payLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] transition-all text-white py-4 rounded-full mt-5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {payLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{subtotal}
                  <FiChevronRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
              Secured by Razorpay · 256-bit SSL encryption
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}