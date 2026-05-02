import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdExpandMore,
  MdExpandLess,
  MdRefresh,
  MdCategory,
} from "react-icons/md";

const BASE = "http://localhost:5000";

export default function ProductDashboard() {
  const [page, setPage]                         = useState("list");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [catOpen, setCatOpen]                   = useState(true);

  const [categories, setCategories]     = useState([]);
  const [products, setProducts]         = useState([]);
  const [loadingCats, setLoadingCats]   = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [error, setError]               = useState(null);

  const [search, setSearch] = useState("");

  const emptyForm = { name: "", price: "", description: "", category_id: "", image: null };
  const [form, setForm]       = useState(emptyForm);
  const [editId, setEditId]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving]   = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setLoadingCats(true);
    axios
      .get(`${BASE}/getCategory`)
      .then((r) => setCategories(r.data))
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategoryId]); // eslint-disable-line

  const fetchProducts = () => {
    setLoadingProds(true);
    setError(null);
    const url = activeCategoryId
      ? `${BASE}/product/${activeCategoryId}`
      : `${BASE}/product`;
    axios
      .get(url)
      .then((r) => setProducts(r.data))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoadingProds(false));
  };

  const countFor = (catId) => products.filter((p) => p.category_id === catId).length;

  const filtered = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCatLabel =
    activeCategoryId === null
      ? "All products"
      : (categories.find((c) => c.id === activeCategoryId)?.name ?? "Products");

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
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => {
    setForm(emptyForm);
    setPreview(null);
    setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => { resetForm(); setPage("add"); };

  const openEdit = (product) => {
    setEditId(product.id);
    setForm({
      name:        product.name,
      price:       product.price,
      description: product.description || "",
      category_id: product.category_id,
      image:       null,
    });
    setPreview(product.image || null);
    setPage("edit");
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category_id)
      return alert("Name, price and category are required.");
    if (!form.image) return alert("Please upload a product image.");
    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("price",       form.price);
    fd.append("description", form.description);
    fd.append("category_id", form.category_id);
    fd.append("image",       form.image);
    try {
      setSaving(true);
      await axios.post(`${BASE}/addProduct`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      resetForm(); setPage("list"); fetchProducts();
    } catch { alert("Something went wrong while adding the product."); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.category_id)
      return alert("Name, price and category are required.");
    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("price",       form.price);
    fd.append("description", form.description);
    fd.append("category_id", form.category_id);
    if (form.image) fd.append("image", form.image);
    try {
      setSaving(true);
      await axios.put(`${BASE}/updateProduct/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      resetForm(); setPage("list"); fetchProducts();
    } catch { alert("Something went wrong while updating the product."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE}/deleteProduct/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch { alert("Failed to delete product."); }
  };

  const isFormPage = page === "add" || page === "edit";

  const navItems = [
    { label: "Overview",    icon: <MdGridView size={17} />,     key: "overview",    to: null },
    { label: "Categories",  icon: <MdCategory size={17} />,     key: "categories",  to: "/category-dashboard" },
    { label: "Products",    icon: <MdInventory2 size={17} />,   key: "products",    to: null },
    { label: "Orders",      icon: <MdReceiptLong size={17} />,  key: "orders",      to: null },
    { label: "Customers",   icon: <MdPeople size={17} />,       key: "customers",   to: null },
    { label: "Analytics",   icon: <MdBarChart size={17} />,     key: "analytics",   to: null },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-56 bg-gray-900 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-semibold text-sm tracking-tight">Shopcraft</p>
          <p className="text-white/40 text-xs mt-0.5 font-mono">Admin panel</p>
        </div>

        <nav className="flex flex-col gap-0.5 mt-3">
          {navItems.map((item) => {
            const isActive = item.key === "products";

            const inner = (
              <div
                className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-all border-l-2
                  ${isActive
                    ? "bg-white/10 text-white border-lime-400"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5 border-transparent"
                  }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.key === "products" && (
                  catOpen
                    ? <MdExpandLess size={15} className="text-white/40" />
                    : <MdExpandMore size={15} className="text-white/40" />
                )}
              </div>
            );

            return (
              <div key={item.label}>
                {item.to ? (
                  <Link to={item.to} className="block">{inner}</Link>
                ) : (
                  <div onClick={() => {
                    if (item.key === "products") { setPage("list"); setCatOpen((o) => !o); }
                  }}>
                    {inner}
                  </div>
                )}

                {/* Category dropdown */}
                {item.key === "products" && catOpen && (
                  <div className="ml-5 border-l border-white/10 flex flex-col gap-0.5 py-1">
                    <button
                      onClick={() => { setActiveCategoryId(null); setPage("list"); }}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 text-xs transition-colors
                        ${activeCategoryId === null ? "text-lime-400 font-medium" : "text-white/55 hover:text-white/80"}`}
                    >
                      <span>All products</span>
                      <span className="font-mono text-[10px] opacity-70">{products.length}</span>
                    </button>

                    {loadingCats ? (
                      <p className="px-4 py-2 text-xs text-white/30 font-mono">Loading…</p>
                    ) : (
                      categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveCategoryId(cat.id); setPage("list"); }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2 text-xs transition-colors
                            ${activeCategoryId === cat.id ? "text-lime-400 font-medium" : "text-white/55 hover:text-white/80"}`}
                        >
                          <span>{cat.name}</span>
                          <span className="font-mono text-[10px] opacity-70">{countFor(cat.id)}</span>
                        </button>
                      ))
                    )}

                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={openAdd}
                        className="flex items-center gap-1.5 w-full text-left px-4 py-2 text-xs text-lime-400/80 hover:text-lime-400 transition-colors"
                      >
                        <MdAdd size={13} />
                        Add new product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-gray-900 tracking-tight">
              {page === "list" ? activeCatLabel : page === "add" ? "Add product" : "Edit product"}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {page === "list"
                ? `Products / ${activeCategoryId === null ? "All" : activeCatLabel}`
                : page === "add" ? "Products / New" : `Products / Edit #${editId}`}
            </p>
          </div>

          {page === "list" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchProducts}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                title="Refresh"
              >
                <MdRefresh size={16} />
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-lime-400 text-gray-900 hover:bg-lime-300 transition-colors"
              >
                <MdAdd size={15} />
                Add product
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => { resetForm(); setPage("list"); }}
                className="text-xs font-medium px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ← Back to list
              </button>
              <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-lime-100 text-lime-700">
                {page === "add" ? "Draft" : "Editing"}
              </span>
            </div>
          )}
        </header>

        {/* LIST PAGE */}
        {page === "list" && (
          <div className="flex-1 p-8 flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
                {error}
                <button onClick={fetchProducts} className="underline">Retry</button>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="relative w-72">
                <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all placeholder:text-gray-400"
                />
              </div>
              <p className="text-xs text-gray-500 font-mono">
                {loadingProds ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {loadingProds ? (
                <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
                  <MdRefresh size={20} className="animate-spin" />
                  <span className="text-sm">Loading products…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <MdInventory2 size={40} className="text-gray-300" />
                  <p className="text-sm text-gray-500">No products found</p>
                  <button
                    onClick={openAdd}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-lime-400 text-gray-900 hover:bg-lime-300 transition-colors mt-1"
                  >
                    Add first product
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 w-12">#</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Product</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Description</th>
                      <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Price</th>
                      <th className="px-4 py-3 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product, i) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-6 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              ) : (
                                <MdImage size={16} className="text-gray-400" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900 whitespace-nowrap">{product.name}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-lime-50 text-lime-700 border border-lime-100">
                            {product.category_name}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                          {product.description || <span className="text-gray-400 italic">—</span>}
                        </td>

                        <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </td>

                        {/* Always-visible colored action buttons */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <MdEdit size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <MdDelete size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ADD / EDIT PAGE */}
        {isFormPage && (
          <div className="flex-1 p-8 grid grid-cols-[1fr_288px] gap-5 items-start">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Product info</p>
                <span className="text-xs text-gray-500 font-mono">5 fields</span>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Product name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Premium Cotton T-Shirt"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a category…</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the product — materials, fit, key features…"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-100 transition-all bg-gray-50 focus-within:bg-white">
                    <span className="px-3 py-2.5 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 font-mono shrink-0">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="flex-1 px-3.5 py-2.5 text-sm bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Product image
                    {page === "add" && <span className="text-red-400"> *</span>}
                    {page === "edit" && <span className="text-gray-400 font-normal"> (leave blank to keep current)</span>}
                  </label>
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="preview" className="w-full h-44 object-cover rounded-xl border border-gray-200" />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <MdClose size={14} />
                      </button>
                      {form.image && <p className="text-xs text-gray-500 mt-1.5 font-mono truncate">{form.image.name}</p>}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer bg-gray-50 hover:border-lime-400 hover:bg-lime-50/40 transition-all text-center">
                      <MdCloudUpload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">Click to upload image</span>
                      <span className="text-xs text-gray-500 font-mono">PNG, JPG, WEBP — max 5 MB</span>
                      <input ref={fileRef} type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={resetForm}
                  className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={page === "add" ? handleAdd : handleUpdate}
                  disabled={saving || !form.name || !form.price || !form.category_id}
                  className="px-5 py-2 text-sm font-semibold bg-lime-400 text-gray-900 rounded-xl hover:bg-lime-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving
                    ? (page === "add" ? "Adding…" : "Saving…")
                    : (page === "add" ? "Add product" : "Save changes")}
                </button>
              </div>
            </div>

            {/* Preview panel */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest font-mono">Live preview</p>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="h-44 bg-gray-100 border-b border-gray-100 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <MdImage size={40} className="text-gray-500" />
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className={`text-sm font-semibold tracking-tight mb-1 ${form.name ? "text-gray-900" : "text-gray-400"}`}>
                    {form.name || "Product name"}
                  </p>
                  {form.category_id && (
                    <span className="inline-block text-xs font-mono px-2.5 py-0.5 rounded-full bg-lime-50 text-lime-700 border border-lime-100 mb-2">
                      {categories.find((c) => c.id === parseInt(form.category_id))?.name}
                    </span>
                  )}
                  <p className={`text-xs leading-relaxed mb-3 line-clamp-3 ${form.description ? "text-gray-600" : "text-gray-400"}`}>
                    {form.description || "Description will appear here…"}
                  </p>
                  <p className={`text-xl font-bold font-mono tracking-tight ${form.price ? "text-gray-900" : "text-gray-400"}`}>
                    {form.price ? `₹${parseFloat(form.price).toFixed(2)}` : "₹0.00"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-4">
                <p className="text-xs font-mono font-semibold text-white/50 uppercase tracking-widest mb-3">Tips</p>
                <ul className="flex flex-col gap-2.5">
                  {["Use a square image for best results", "Keep name under 60 characters", "Write a keyword-rich description", "Always assign a category"].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}