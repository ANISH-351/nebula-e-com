import React, { useState } from "react";
import {
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";
import ProfileSidebar from "./ProfileSidebar";

function Address() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      fullName: "Anish",
      phone: "9876543210",
      addressLine: "123 Main Street",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641001",
      country: "India",
      default: true,
    },
    {
      id: 2,
      label: "Office",
      fullName: "Anish",
      phone: "9876543210",
      addressLine: "Tech Park Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641045",
      country: "India",
      default: false,
    },
  ]);

  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      label: "",
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });

    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address.id);
    setFormData(address);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
          default: false,
        },
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((item) => item.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((item) => ({
        ...item,
        default: item.id === id,
      }))
    );
  };

  return (
    <section className="py-10 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          <ProfileSidebar />

          <div className="bg-[#faf7f2] rounded-[35px] p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              <div>
                <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
                  Delivery Details
                </span>

                <h2 className="text-3xl lg:text-4xl font-serif mt-2">
                  Saved Addresses
                </h2>
              </div>

              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-[#c5a46d] hover:bg-[#b89552] text-white px-6 py-3 rounded-full transition"
              >
                <FiPlus />
                Add Address
              </button>

            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white border border-[#eee3d2] rounded-[30px] p-6 mb-8">

                <h3 className="text-2xl font-serif mb-6">
                  {editingId ? "Edit Address" : "Add Address"}
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="Home / Office"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none"
                  />

                  <textarea
                    rows="4"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="Address"
                    className="md:col-span-2 border border-[#e6dcc8] rounded-2xl px-4 py-4 outline-none resize-none"
                  />

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#c5a46d] text-white px-6 py-3 rounded-full"
                  >
                    <FiSave />
                    Save Address
                  </button>

                  <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-full"
                  >
                    <FiX />
                    Cancel
                  </button>

                </div>

              </div>
            )}

            {/* Address Cards */}
            <div className="space-y-6">

              {addresses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[30px] border border-[#eee3d2] p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                    <div className="flex gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-[#faf7f2] flex items-center justify-center">
                        <FiMapPin
                          className="text-[#b89552]"
                          size={24}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">

                          <h3 className="text-xl font-semibold">
                            {item.label}
                          </h3>

                          {item.default && (
                            <span className="bg-[#faf7f2] text-[#b89552] px-3 py-1 rounded-full text-sm">
                              Default
                            </span>
                          )}

                        </div>

                        <p className="mt-3 font-medium">
                          {item.fullName}
                        </p>

                        <p className="text-gray-500">
                          +91 {item.phone}
                        </p>

                        <p className="text-gray-500 mt-3 leading-relaxed">
                          {item.addressLine}, {item.city},{" "}
                          {item.state} - {item.pincode}
                          <br />
                          {item.country}
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-3 h-fit">

                      {!item.default && (
                        <button
                          onClick={() =>
                            setDefaultAddress(item.id)
                          }
                          className="px-4 py-2 rounded-full border border-[#d9c4a0] text-[#b89552]"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={() => openEditForm(item)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#d9c4a0] text-[#b89552]"
                      >
                        <FiEdit2 />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-500"
                      >
                        <FiTrash2 />
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Address;