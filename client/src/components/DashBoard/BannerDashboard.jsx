import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MdGridView, MdInventory2, MdReceiptLong, MdPeople,
  MdBarChart, MdAdd, MdDelete, MdCategory, MdEdit, MdCheck, MdClose,
  MdImage, MdViewCarousel,
} from "react-icons/md";

const BASE = "http://localhost:5000";

export default function BannerDashboard() {
  const [banners, setBanners]         = useState([]);
  const [loadingBanners, setLoading]  = useState(false);
  const [saving, setSaving]           = useState(false);

  // ── Add form state ──
  const [newTitle, setNewTitle]       = useState("");
  const [newImage, setNewImage]       = useState(null);
  const [newPreview, setNewPreview]   = useState(null);

  // ── Edit state ──
  const [editingId, setEditingId]     = useState(null);
  const [editTitle, setEditTitle]     = useState("");
  const [editImage, setEditImage]     = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  // ── Delete state ──
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addFileRef  = useRef(null);
  const editFileRef = useRef(null);

  /* ── Fetch ── */
  const fetchBanners = () => {
    setLoading(true);
    axios
      .get(`${BASE}/getBanners`)
      .then((r) => setBanners(r.data))
      .catch(() => alert("Failed to load banners."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  /* ── Add image picker ── */
  const onNewImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const clearNewImage = () => {
    setNewImage(null);
    setNewPreview(null);
    if (addFileRef.current) addFileRef.current.value = "";
  };

  /* ── Add banner ── */
  const handleAdd = async () => {
    if (!newTitle.trim()) return alert("Banner title is required");
    if (!newImage)        return alert("Banner image is required");
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("title", newTitle);
      fd.append("image", newImage);
      await axios.post(`${BASE}/addBanner`, fd);
      setNewTitle("");
      clearNewImage();
      fetchBanners();
    } catch { alert("Error adding banner."); }
    finally  { setSaving(false); }
  };

  /* ── Edit helpers ── */
  const startEdit = (b) => {
    setEditingId(b.id);
    setEditTitle(b.title);
    setEditImage(null);
    setEditPreview(b.image || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
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
    if (!editTitle.trim()) return alert("Title cannot be empty");
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
      if (editImage) fd.append("image", editImage);
      await axios.put(`${BASE}/updateBanner/${id}`, fd);
      cancelEdit();
      fetchBanners();
    } catch { alert("Error updating banner."); }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${BASE}/deleteBanner/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchBanners();
    } catch { alert("Error deleting banner."); }
  };

  /* ── Nav ── */
  const navItems = [
    { label: "Overview",   icon: <MdGridView size={17} />,       key: "overview",   to: null },
    { label: "Banners",    icon: <MdViewCarousel size={17} />,   key: "banners",    to: null },
    { label: "Categories", icon: <MdCategory size={17} />,       key: "categories", to: "/category-dashboard" },
    { label: "Products",   icon: <MdInventory2 size={17} />,     key: "products",   to: "/product-dashboard" },
    { label: "Orders",     icon: <MdReceiptLong size={17} />,    key: "orders",     to: null },
    { label: "Customers",  icon: <MdPeople size={17} />,         key: "customers",  to: null },
    { label: "Analytics",  icon: <MdBarChart size={17} />,       key: "analytics",  to: null },
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
            const isActive = item.key === "banners";
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
            <p className="text-sm font-semibold text-gray-900 tracking-tight">Banner Management</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Setup &amp; manage promotional banners</p>
          </div>
        </header>

        <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">

          {/* ADD CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <p className="text-sm font-bold text-gray-800">Add New Banner</p>
            </div>
            <div className="p-6 flex flex-col gap-5">

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Summer Sale, New Arrivals..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-100 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Banner Image
                </label>

                {newPreview ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={newPreview}
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
                onClick={handleAdd}
                disabled={saving || !newTitle.trim() || !newImage}
                className="w-full py-3 text-xs font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? "Creating..." : <><MdAdd size={16} /> Create Banner</>}
              </button>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Active Banners</p>
              <span className="text-xs font-mono text-gray-500">{banners.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">Image</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100">Title</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingBanners ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-gray-500 italic">Loading banners...</td>
                    </tr>
                  ) : banners.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-20 text-gray-500 italic">No banners created yet.</td>
                    </tr>
                  ) : (
                    banners.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">

                        {/* ID */}
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{b.id}</td>

                        {/* Image cell */}
                        <td className="px-6 py-4">
                          {editingId === b.id ? (
                            <div className="flex items-center gap-3">
                              {/* Banner preview is wider ratio */}
                              <div className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
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
                            <div className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                              {b.image ? (
                                <img
                                  src={b.image}
                                  alt={b.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <MdImage size={18} className="text-gray-300" />
                              )}
                            </div>
                          )}
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          {editingId === b.id ? (
                            <input
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")  handleUpdate(b.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              className="px-3 py-1.5 text-sm border border-lime-400 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-lime-100 w-48"
                            />
                          ) : (
                            <span className="font-semibold text-gray-800">{b.title}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {editingId === b.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(b.id)}
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
                                  onClick={() => startEdit(b)}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                  title="Edit"
                                >
                                  <MdEdit size={17} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(b)}
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
            <h3 className="font-bold text-gray-900 mb-1">Delete Banner?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">"{deleteTarget.title}"</span>? This cannot be undone.
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