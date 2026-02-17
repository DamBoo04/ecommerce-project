import { useEffect, useState } from "react";
import API from "../../api"; // adjust path if needed

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ open: false, category: null });
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (c = null) => {
    setModal({ open: true, category: c });
    setName(c?.name || "");
  };

  const closeModal = () => setModal({ open: false, category: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.category) {
        await API.put(`/categories/${modal.category.id}`, { name });
      } else {
        await API.post("/categories", { name });
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      console.error("Create/Update category failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
          <p className="text-sm text-gray-500">Manage product categories</p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Category Name</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-400">
                  No categories available
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    #{c.id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.name}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openModal(c)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {modal.category ? "Edit Category" : "Add Category"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {modal.category
                ? "Update the category information"
                : "Create a new category"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
