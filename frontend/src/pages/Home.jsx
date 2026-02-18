import { useState, useEffect } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import Customers from "../components/Customers";
import Products from "../pages/Products";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products"),
        ]);

        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  // Get popular products (top 8 by popularity or just first 8)
  const popularProducts = [...products]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Carousel */}
      <Carousel />

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Popular Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Products
                key={product.id}
                product={product}
                onAddToCart={(item) => console.log("Add to cart:", item)}
              />
            ))}
          </div>
        </section>
      )}
      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-14">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl px-6 py-2 md:px-10 md:py-4 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              Shop $40 & Get Free Delivery!
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-white/90">
              Limited time offer on selected items.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            to="/products"
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-md hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
          >
            Grab Deals
          </Link>
        </div>
      </section>
      {/* Products By Category */}
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category_id === category.id,
        );
        if (!categoryProducts.length) return null; // skip empty categories

        return (
          <section key={category.id} className="max-w-7xl mx-auto px-4 mt-14">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {category.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <Products
                  key={product.id}
                  product={product}
                  onAddToCart={(item) => console.log("Add to cart:", item)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Customers Say */}
      <Customers />
    </div>
  );
}
