import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        // Mock reviews if not available from API
        setReviews([
          { id: 1, user: "Alice", rating: 5, comment: "Excellent product!" },
          { id: 2, user: "Bob", rating: 4, comment: "Good value for money." },
        ]);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (!product)
    return <p className="p-6 text-center text-red-500">Product not found.</p>;

  // Auto discount logic
  const discountPercentage = product.price >= 100 ? 20 : 10;
  const discountedPrice = (
    product.price *
    (1 - discountPercentage / 100)
  ).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="md:w-1/2 relative">
          {product.image && (
            <img
              src={`http://127.0.0.1:8000/storage/${product.image}`}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-2xl shadow"
            />
          )}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-xl font-bold shadow">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <button
              onClick={() => setFavorite(!favorite)}
              className="ml-2 text-gray-400 hover:text-red-500 transition"
            >
              <i className={`fa${favorite ? "s" : "r"} fa-heart text-2xl`}></i>
            </button>
          </div>

          {product.brand && (
            <p className="text-gray-500 text-sm mt-1">{product.brand.name}</p>
          )}

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl text-purple-700 font-bold">
              ${discountedPrice}
            </span>
            {discountPercentage > 0 && (
              <span className="text-gray-400 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Select Size:</h3>
            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-xl transition ${
                    selectedSize === size
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-700">{product.description}</p>

          {/* Add to Cart */}
          <button
            onClick={() =>
              console.log("Add to cart:", product, "Size:", selectedSize)
            }
            className="mt-6 w-48 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
          >
            Add to Cart
          </button>

          {/* Reviews */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((rev) => (
                  <li key={rev.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">{rev.user}</span>
                      <span className="text-yellow-400">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{rev.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
