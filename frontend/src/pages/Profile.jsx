import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    homeAddress: "",
    deliveryAddress: "",
    pickUpPoint: "",
    company: "",
    fiscalCode: "",
    avatar:
      "https://img.freepik.com/premium-vector/school-boy-vector-illustration_38694-902.jpg?semt=ais_user_personalization&w=740&q=80",
  });

  const [stats, setStats] = useState({
    orders: 2,
    reviews: 3,
    favorites: 8,
    returns: 0,
    ordersChange: 20,
    reviewsChange: 39,
    favoritesChange: 32,
    returnsChange: 0,
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/profile/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put("/profile", user);
      alert(res.data.message);
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error(error.response?.data);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 p-6">
      {/* ===== General Overview ===== */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        General Overview
      </h2>

      {/* ===== Profile Card ===== */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-8 relative">
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
          <span className="mt-3 inline-block bg-indigo-600 text-white text-sm px-4 py-1 rounded-full font-semibold">
            {user.role || "User"} Account
          </span>
        </div>

        {/* Info Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-500">Username</p>
              {editing ? (
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.name}</h2>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-500">Email Address</p>
              {editing ? (
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-500">Home Address</p>
              <p className="flex items-start gap-2 text-gray-600">
                <i className="fa-solid fa-location-dot mt-1 text-indigo-600"></i>
                {user.homeAddress || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">Delivery Address</p>
              <p className="flex items-start gap-2 text-gray-600">
                <i className="fa-solid fa-truck mt-1 text-indigo-600"></i>
                {user.deliveryAddress || "N/A"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-500">Phone Number</p>
              {editing ? (
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-500">
                Favorite Pick-up Point
              </p>
              <p className="flex items-start gap-2 text-gray-600">
                <i className="fa-solid fa-location-dot mt-1 text-indigo-600"></i>
                {user.pickUpPoint || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">My Companies</p>
              <p className="text-gray-600">
                {user.company || "N/A"}, Fiscal code: {user.fiscalCode || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">Payment Methods</p>
              <div className="flex items-center mt-2">
                <img
                  src="https://bredcambodia.com.kh/wp-content/uploads/2022/12/KHQR-available-here-logo-with-bg.png"
                  alt="Payment"
                  className="w-14 object-contain shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Buttons */}
        <div className="absolute bottom-6 right-6">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition flex items-center gap-2"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
        {[
          {
            icon: "fa-cart-shopping",
            value: stats.orders,
            change: stats.ordersChange,
            color: "text-indigo-600",
            label: "Orders",
          },
          {
            icon: "fa-star",
            value: stats.reviews,
            change: stats.reviewsChange,
            color: "text-yellow-500",
            label: "Reviews",
          },
          {
            icon: "fa-heart",
            value: stats.favorites,
            change: stats.favoritesChange,
            color: "text-red-500",
            label: "Favorites",
          },
          {
            icon: "fa-rotate-left",
            value: stats.returns,
            change: stats.returnsChange,
            color: "text-green-600",
            label: "Returns",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-5 flex flex-col items-center hover:shadow-lg transition"
          >
            <i
              className={`fa-solid ${stat.icon} text-3xl mb-2 ${stat.color}`}
            ></i>
            <span className="text-2xl font-bold">{stat.value}</span>
            <span
              className={`text-sm ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stat.change >= 0
                ? `↑ ${stat.change}%`
                : `↓ ${Math.abs(stat.change)}%`}
            </span>
            <span className="text-xs text-gray-400 mt-1">vs last 3 months</span>
            <span className="text-sm font-medium mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
