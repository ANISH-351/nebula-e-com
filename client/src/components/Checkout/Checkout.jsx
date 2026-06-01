import React, { useState, useEffect } from "react";
import { FiTruck, FiPlus, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../components/const";

const user_id = localStorage.getItem("user_id");

const EMPTY_FORM = {
  full_name: "", phone: "", pincode: "", city: "",
  state: "", country: "", address_line: ""
};

export default function Checkout() {
  const { cartItems } = useSelector((s) => s.cart);

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [addrLoading, setAddrLoading] = useState(true);

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

  const openAdd = () => {
    setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true);
  };

  const openEdit = (addr) => {
    setForm({
      full_name: addr.full_name, phone: addr.phone, pincode: addr.pincode,
      city: addr.city, state: addr.state, country: addr.country, address_line: addr.address_line
    });
    setEditingId(addr.id); setErrors({}); setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setErrors({}); };

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

  const inputClass = (field) =>
    `w-full bg-white border rounded-2xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-400 ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#e6dcc8] focus:border-[#b89552]"
    }`;

  return (
    <section className="w-full bg-white py-10 lg:py-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px]">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">Secure Checkout</p>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-serif text-gray-900 mt-2 leading-tight">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 xl:gap-12 items-start">

          {/* Shipping Address */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b89552]/10 flex items-center justify-center">
                  <FiTruck size={16} className="text-[#b89552]" />
                </div>
                <h2 className="text-xl font-serif text-gray-900">Shipping Address</h2>
              </div>
              {!showForm && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#b89552] border border-[#d9c4a0] px-3.5 py-2 rounded-full hover:bg-white transition"
                >
                  <FiPlus size={13} /> Add New
                </button>
              )}
            </div>

            {/* Address list */}
            {!showForm && (
              <div className="space-y-3">
                {addrLoading && (
                  <>
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-24 rounded-2xl bg-white/60 animate-pulse" />
                    ))}
                  </>
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
                    className={`flex items-start gap-4 cursor-pointer rounded-2xl border p-4 transition-all ${
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

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{addr.full_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{addr.address_line}, {addr.city}</p>
                      <p className="text-xs text-gray-500">{addr.state}, {addr.pincode}, {addr.country}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(addr)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#b89552] hover:bg-[#fdf6ec] transition"
                        aria-label="Edit"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        aria-label="Remove"
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
                <div className="grid md:grid-cols-2 gap-3">
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
                  <div className="md:col-span-2">
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
                <div className="flex gap-3 mt-5">
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

          {/* Order Summary */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-serif text-gray-900">Order Summary</h2>

            {/* Cart items */}
            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">₹{item.price * item.quantity}</span>
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
              disabled={!selectedId || cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] transition-all text-white py-4 rounded-full mt-5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
              <FiChevronRight size={16} />
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
              By placing your order you agree to our Terms & Privacy Policy
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}