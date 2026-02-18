import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartItemCard({ product }) {
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = (e) => {
    e.stopPropagation(); // prevent navigating when clicking favorite
    setFavorite(!favorite);
  };

  // Example: auto discount logic (10% off)
  const discountPercentage = product.price >= 100 ? 25 : 19; // auto discount
  const discountedPrice = (
    product.price *
    (1 - discountPercentage / 100)
  ).toFixed(2);

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 duration-300 overflow-hidden cursor-pointer relative"
    >
      {/* Product Image */}
      {product.image && (
        <div className="relative">
          <img
            src={`http://127.0.0.1:8000/storage/${product.image}`}
            alt={product.name}
            className="w-full h-60 object-cover"
          />
          {/* Discount Badge */}
          <div className="absolute top-3 left-3 bg-red-600 text-gray-200 px-2 py-1 rounded-lg text-xs font-bold shadow">
            -{discountPercentage}%
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Product Name + Favorite */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <button onClick={toggleFavorite} className="ml-2">
            <i
              className={`fa${favorite ? "s" : "r"} fa-heart text-lg ${
                favorite ? "text-red-500" : "text-gray-400"
              } hover:text-red-500 transition`}
            ></i>
          </button>
        </div>

        {product.brand && (
          <p className="text-gray-500 text-sm mt-1">{product.brand.name}</p>
        )}

        {/* Price with discount */}
        <div className="mt-2">
          <span className="text-purple-700 font-bold text-lg">
            ${discountedPrice}
          </span>
          {discountPercentage > 0 && (
            <span className="text-gray-400 line-through ml-2">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
