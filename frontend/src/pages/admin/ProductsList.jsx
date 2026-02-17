import { useEffect, useState } from "react";
import API from "../../api";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [modal, setModal] = useState({ open: false, product: null });
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    price: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const fetchData = async () => {
    try {
      const [p, c, b] = await Promise.all([
        API.get("/products"),
        API.get("/categories"),
        API.get("/brands"),
      ]);

      setProducts(p.data);
      setCategories(c.data);
      setBrands(b.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.image) {
      setPreview(URL.createObjectURL(formData.image));
    }
  }, [formData.image]);

  const filteredProducts = products.filter((p) => {
    return (
      (filterBrand ? p.brand_id == filterBrand : true) &&
      (filterCategory ? p.category_id == filterCategory : true)
    );
  });

  const openModal = (product = null) => {
    setModal({ open: true, product });

    if (product) {
      setFormData({
        name: product.name || "",
        brand_id: product.brand_id || "",
        category_id: product.category_id || "",
        price: product.price || "",
        description: product.description || "",
        image: null,
      });
      setPreview(
        product.image ? `http://127.0.0.1:8000/storage/${product.image}` : null,
      );
    } else {
      setFormData({
        name: "",
        brand_id: "",
        category_id: "",
        price: "",
        description: "",
        image: null,
      });
      setPreview(null);
    }
  };

  const closeModal = () => {
    setModal({ open: false, product: null });
    setPreview(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "")
          body.append(key, formData[key]);
      });

      if (modal.product) {
        await API.post(`/products/${modal.product.id}?_method=PUT`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/products", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      closeModal();
      fetchData();
    } catch (err) {
      console.error("Create/Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage product catalog</p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-60"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-60"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Brand</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    #{p.id}
                  </td>
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${p.image}`}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-700">
                    {p.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {p.brand?.name || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {p.category?.name || "-"}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ${p.price}
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openModal(p)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {modal.product ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-black"
                required
              />

              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
              />

              {/* Image preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              )}

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600"
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
