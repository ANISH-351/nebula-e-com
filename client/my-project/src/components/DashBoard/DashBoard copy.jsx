import { useState, useRef } from "react";
import axios from "axios";
import {
  MdGridView,
  MdInventory2,
  MdReceiptLong,
  MdPeople,
  MdBarChart,
  MdCloudUpload,
  MdImage,
  MdClose,
} from "react-icons/md";

export default function Dashboard() {
  const [form, setForm] = useState({ name: "", price: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((f) => ({ ...f, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, image: null }));
    setPreview(null);
    fileRef.current.value = "";
  };

  const handleClear = () => {
    setForm({ name: "", price: "", description: "", image: null });
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required.");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/addProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added ✅");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: "Overview",   icon: <MdGridView size={17} /> },
    { label: "Products",   icon: <MdInventory2 size={17} />, active: true },
    { label: "Orders",     icon: <MdReceiptLong size={17} /> },
    { label: "Customers",  icon: <MdPeople size={17} /> },
    { label: "Analytics",  icon: <MdBarChart size={17} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-gray-900 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-semibold text-sm tracking-tight">Shopcraft</p>
          <p className="text-white/30 text-xs mt-0.5 font-mono">Admin panel</p>
        </div>
        <nav className="flex flex-col gap-0.5 mt-3">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-all border-l-2
                ${item.active
                  ? "bg-white/10 text-white border-lime-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border-transparent"
                }`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-gray-900 tracking-tight">Add product</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Products / New</p>
          </div>
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-lime-100 text-lime-700">
            Draft
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 grid grid-cols-[1fr_288px] gap-5 items-start">

          {/* ── Form Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">Product info</p>
              <span className="text-xs text-gray-400 font-mono">4 fields</span>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Product name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the product — materials, fit, key features…"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all resize-none placeholder:text-gray-300"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Price <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-100 transition-all bg-gray-50 focus-within:bg-white">
                  <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-100 border-r border-gray-200 font-mono shrink-0">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="flex-1 px-3.5 py-2.5 text-sm bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Product image
                </label>
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-44 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <MdClose size={14} />
                    </button>
                    <p className="text-xs text-gray-400 mt-1.5 font-mono truncate">{form.image?.name}</p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer bg-gray-50 hover:border-lime-400 hover:bg-lime-50/40 transition-all text-center">
                    <MdCloudUpload size={32} className="text-gray-300" />
                    <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                    <span className="text-xs text-gray-400 font-mono">PNG, JPG, WEBP — max 5 MB</span>
                    <input
                      ref={fileRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleClear}
                className="px-5 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.price}
                className="px-5 py-2 text-sm font-semibold bg-lime-400 text-gray-900 rounded-xl hover:bg-lime-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Adding…" : "Add product"}
              </button>
            </div>
          </div>

          {/* ── Preview Panel ── */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest font-mono">
              Live preview
            </p>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="h-44 bg-gray-100 border-b border-gray-100 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-25">
                    <MdImage size={40} className="text-gray-500" />
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <p className={`text-sm font-semibold tracking-tight mb-1 ${form.name ? "text-gray-900" : "text-gray-300"}`}>
                  {form.name || "Product name"}
                </p>
                <p className={`text-xs leading-relaxed mb-3 line-clamp-3 ${form.description ? "text-gray-500" : "text-gray-300"}`}>
                  {form.description || "Description will appear here…"}
                </p>
                <p className={`text-xl font-bold font-mono tracking-tight ${form.price ? "text-gray-900" : "text-gray-300"}`}>
                  {form.price ? `₹${parseFloat(form.price).toFixed(2)}` : "₹0.00"}
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 rounded-2xl p-4">
              <p className="text-xs font-mono font-semibold text-white/40 uppercase tracking-widest mb-3">
                Tips
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Use a square image for best results",
                  "Keep name under 60 characters",
                  "Write a keyword-rich description",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}