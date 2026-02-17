import { useEffect, useState } from "react";
import API from "../../api"; // adjust path if needed

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ open: false, user: null });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (!token) window.location.href = "/login";
    fetchUsers();
  }, [token]);

  const openModal = (u = null) => {
    setModal({ open: true, user: u });
    setFormData({
      name: u?.name || "",
      email: u?.email || "",
      phone: u?.phone || "",
    });
  };

  const closeModal = () => setModal({ open: false, user: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.user) {
        await API.put(`/users/${modal.user.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Update/Create failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          <p className="text-sm text-gray-500">Manage registered users</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No users available
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    #{user.id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.email || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.phone || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openModal(user)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
              {modal.user ? "Edit User" : "Add User"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {modal.user ? "Update the user information" : "Create a new user"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone"
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
