import React, { useState } from "react";
import { FiTruck, FiLock, FiPlus, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";

import shirt from "../../assets/home-images/shirt.png";
import pant from "../../assets/home-images/pant.png";

const cartItems = [
  { id: 1, name: "Premium Beige Shirt", size: "M", quantity: 1, price: 89, image: shirt },
  { id: 2, name: "Classic Formal Pant", size: "L", quantity: 2, price: 120, image: pant },
];

const EMPTY_FORM = { firstName: "", lastName: "", email: "", street: "", city: "", postal: "", country: "" };

export default function Checkout() {
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const tax = 12;
  const total = subtotal + tax;

  const [addresses, setAddresses] = useState([
    { id: 1, firstName: "Alex", lastName: "Morgan", email: "alex@email.com", street: "24 Mayfair Lane", city: "London", postal: "W1K 2HP", country: "United Kingdom" },
    { id: 2, firstName: "Alex", lastName: "Morgan", email: "alex@email.com", street: "10 Park Avenue", city: "New York", postal: "10016", country: "United States" },
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postal.trim()) e.postal = "Required";
    if (!form.country.trim()) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true); };
  const openEdit = (addr) => { setForm({ ...addr }); setEditingId(addr.id); setErrors({}); setShowForm(true); };
  const cancelForm = () => { setShowForm(false); setEditingId(null); setErrors({}); };

  const saveAddress = () => {
    if (!validate()) return;
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)));
    } else {
      const newAddr = { ...form, id: Date.now() };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedId(newAddr.id);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      if (remaining.length) setSelectedId(remaining[0].id);
    }
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

        {/* Layout */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 xl:gap-12 items-start">

          {/* ── Left: Shipping Address ── */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8">

            {/* Section header */}
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

            {/* Address cards */}
            {!showForm && (
              <div className="space-y-3">
                {addresses.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No saved addresses. Add one above.</p>
                )}
                {addresses.map((addr) => (
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
                      <p className="text-sm font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{addr.street}, {addr.city}</p>
                      <p className="text-xs text-gray-500">{addr.postal}, {addr.country}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.email}</p>
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
                    <input type="text" placeholder="First Name" value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={inputClass("firstName")} />
                    {errors.firstName && <p className="text-xs text-red-400 mt-1 pl-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Last Name" value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={inputClass("lastName")} />
                    {errors.lastName && <p className="text-xs text-red-400 mt-1 pl-1">{errors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input type="email" placeholder="Email Address" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass("email")} />
                    {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input type="text" placeholder="Street Address" value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      className={inputClass("street")} />
                    {errors.street && <p className="text-xs text-red-400 mt-1 pl-1">{errors.street}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="City" value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass("city")} />
                    {errors.city && <p className="text-xs text-red-400 mt-1 pl-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Postal Code" value={form.postal}
                      onChange={(e) => setForm({ ...form, postal: e.target.value })}
                      className={inputClass("postal")} />
                    {errors.postal && <p className="text-xs text-red-400 mt-1 pl-1">{errors.postal}</p>}
                  </div>
                  <div className="md:col-span-2">
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

          {/* ── Right: Order Summary ── */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-serif text-gray-900">Order Summary</h2>

            {/* Price rows */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span className="text-gray-900 font-medium">₹{tax}</span>
              </div>
            </div>

            <div className="border-t border-[#e6dcc8] mt-5 pt-5 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-semibold text-[#b89552]">₹{total}</span>
            </div>

       

            {/* CTA */}
            <button className="w-full flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] transition-all text-white py-4 rounded-full mt-4 text-sm font-medium">
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