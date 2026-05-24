import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MdGridView, MdInventory2, MdReceiptLong, MdPeople,
  MdBarChart, MdAdd, MdDelete, MdCategory, MdEdit, MdCheck, MdClose,
  MdImage,MdViewCarousel
} from "react-icons/md";

const BASE = "https://nebula-bakend.onrender.com";

export default function CategoryDashboard() {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState(null);       // File object
  const [newCatPreview, setNewCatPreview] = useState(null);   // Object URL

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);           // File object
  const [editPreview, setEditPreview] = useState(null);       // current/new preview URL
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addFileRef  = useRef(null);
  const editFileRef = useRef(null);

  const fetchCategories = () => {
    setLoadingCats(true);
    axios
      .get(`${BASE}/getCategory`)
      .then((r) => setCategories(r.data))
      .catch(() => alert("Failed to load categories."))
      .finally(() => setLoadingCats(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  /* ── Add image picker ── */
  const onNewImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewCatImage(file);
    setNewCatPreview(URL.createObjectURL(file));
  };

  const clearNewImage = () => {
    setNewCatImage(null);
    setNewCatPreview(null);
    if (addFileRef.current) addFileRef.current.value = "";
  };

  /* ── Add category ── */
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return alert("Category name is required");
    if (!newCatImage)       return alert("Category image is required");
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name",  newCatName);
      fd.append("image", newCatImage);
      await axios.post(`${BASE}/addcategory`, fd);
      setNewCatName("");
      clearNewImage();
      fetchCategories();
    } catch { alert("Error adding category."); }
    finally  { setSaving(false); }
  };

  /* ── Edit helpers ── */
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditImage(null);
    setEditPreview(cat.image || null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditImage(null);
    setEditPreview(null);
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const onEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  /* ── Update ── */
  const handleUpdate = async (id) => {
    if (!editName.trim()) return alert("Name cannot be empty");
    try {
      const fd = new FormData();
      fd.append("name", editName);
      if (editImage) fd.append("image", editImage);
      await axios.put(`${BASE}/category/${id}`, fd);
      cancelEdit();
      fetchCategories();
    } catch { alert("Error updating category."); }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${BASE}/category/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch { alert("Error deleting category."); }
  };

  const navItems = [
    { label: "Overview",   icon: <MdGridView size={17} />,    key: "overview",    to: null },
     { label: "Banners",    icon: <MdViewCarousel size={17} />,   key: "banners",    to: "/banner-dashboard" },
    { label: "Categories", icon: <MdCategory size={17} />,    key: "categories",  to: null },
    { label: "Products",   icon: <MdInventory2 size={17} />,  key: "products",    to: "/product-dashboard" },
    { label: "Orders",     icon: <MdReceiptLong size={17} />, key: "orders",      to: null },
    { label: "Customers",  icon: <MdPeople size={17} />,      key: "customers",   to: null },
    { label: "Analytics",  icon: <MdBarChart size={17} />,    key: "analytics",   to: null },
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
            const isActive = item.key === "categories";
            const inner = (
              <div
                className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-all border-l-2
                  ${isActive
                    ? "bg-white/10 text-white border-lime-400"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5 border-transparent"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
            return item.to ? (
              <Link key={item.key} to={item.to} className="block">{inner}</Link>
            ) : (
              <div key={item.key}>{inner}</div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-gray-900 tracking-tight">Category Management</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Setup &amp; manage product groups</p>
          </div>
        </header>

        <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">

          {/* ADD CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <p className="text-sm font-bold text-gray-800">Add New Category</p>
            </div>
            <div className="p-6 flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="e.g. Menswear, Gadgets..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category Image
                </label>

                {newCatPreview ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={newCatPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={clearNewImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      title="Remove image"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addFileRef.current?.click()}
                    className="w-full h-36 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-lime-400 hover:bg-lime-50/30 transition-all cursor-pointer text-gray-400 hover:text-lime-500"
                  >
                    <MdImage size={28} />
                    <span className="text-xs font-medium">Click to upload image</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WEBP</span>
                  </button>
                )}

                <input
                  ref={addFileRef}
                  type="file"
                  accept="image/*"
                  onChange={onNewImageChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleAddCategory}
                disabled={saving || !newCatName.trim() || !newCatImage}
                className="w-full py-3 text-xs font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? "Creating..." : <><MdAdd size={16} /> Create Category</>}
              </button>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Active Categories</p>
              <span className="text-xs font-mono text-gray-500">{categories.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">Image</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingCats ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-gray-500 italic">Loading categories...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-gray-500 italic">No categories created yet.</td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">

                        {/* ID */}
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{cat.id}</td>

                        {/* Image cell */}
                        <td className="px-6 py-4">
                          {editingId === cat.id ? (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
                                {editPreview ? (
                                  <img src={editPreview} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                  <MdImage size={18} className="text-gray-300" />
                                )}
                              </div>
                              <button
                                onClick={() => editFileRef.current?.click()}
                                className="text-xs px-2.5 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-lime-400 hover:text-lime-600 hover:bg-lime-50/30 transition-all whitespace-nowrap"
                              >
                                {editImage ? "Change" : "Replace"}
                              </button>
                              <input
                                ref={editFileRef}
                                type="file"
                                accept="image/*"
                                onChange={onEditImageChange}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <MdImage size={18} className="text-gray-300" />
                              )}
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                          {editingId === cat.id ? (
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")  handleUpdate(cat.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              className="px-3 py-1.5 text-sm border border-lime-400 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 w-48"
                            />
                          ) : (
                            <span className="font-semibold text-gray-800">{cat.name}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {editingId === cat.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(cat.id)}
                                  className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-700 transition-colors"
                                  title="Save"
                                >
                                  <MdCheck size={17} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                                  title="Cancel"
                                >
                                  <MdClose size={17} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                  title="Edit"
                                >
                                  <MdEdit size={17} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(cat)}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <MdDelete size={17} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h3 className="font-bold text-gray-900 mb-1">Delete Category?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}