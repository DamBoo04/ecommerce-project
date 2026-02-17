import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductsList from "./ProductsList";
import CategoriesList from "./CategoriesList";
import BrandsList from "./BrandsList";
import Users from "./Users";
import API from "../../api";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    users: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes, usersRes] =
          await Promise.all([
            API.get("/products", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            API.get("/categories", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            API.get("/brands", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            API.get("/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          brands: brandsRes.data.length,
          users: usersRes.data.length,
        });

        setRecentUsers(usersRes.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md rounded-r-2xl transform md:translate-x-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 font-bold text-purple-700 text-2xl flex items-center justify-between">
          AdminPanel
          <button
            className="md:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {[
            "dashboard",
            "products",
            "categories",
            "brands",
            "users",
            "settings",
          ].map((item) => (
            <SidebarItem
              key={item}
              label={item.charAt(0).toUpperCase() + item.slice(1)}
              name={item}
              active={active}
              setActive={setActive}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <header className="bg-white shadow-md px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-600 text-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-xl font-bold text-purple-700 capitalize">
              {active}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 text-sm sm:text-base"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 space-y-6 overflow-x-hidden">
          {active === "dashboard" && (
            <DashboardHome stats={stats} recentUsers={recentUsers} />
          )}
          {active === "products" && <ProductsList token={token} />}
          {active === "categories" && <CategoriesList token={token} />}
          {active === "brands" && <BrandsList token={token} />}
          {active === "users" && <Users token={token} />}
          {active === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ label, name, active, setActive, onClick }) {
  return (
    <button
      onClick={() => {
        setActive(name);
        onClick && onClick();
      }}
      className={`block w-full text-left py-3 px-6 transition rounded-r-xl ${
        active === name
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      }`}
    >
      {label}
    </button>
  );
}

/* Dashboard */
function DashboardHome({ stats, recentUsers }) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title="Total Products"
          value={stats.products}
          color="blue"
          icon="fa-box"
        />
        <Card
          title="Total Categories"
          value={stats.categories}
          color="green"
          icon="fa-layer-group"
        />
        <Card
          title="Total Brands"
          value={stats.brands}
          color="purple"
          icon="fa-tags"
        />
        <Card
          title="Total Users"
          value={stats.users}
          color="red"
          icon="fa-users"
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Users
        </h2>
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    #{u.id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Fancy Card */
function Card({ title, value, color, icon }) {
  const gradients = {
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
    blue: "from-blue-500 to-blue-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradients[color]}`}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">
            {value}
          </h2>
        </div>

        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl text-white bg-gradient-to-br ${gradients[color]}`}
        >
          <i className={`fa-solid ${icon} text-lg sm:text-xl`}></i>
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-10 opacity-10"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 15 L20 10 L40 14 L60 6 L80 12 L100 5 L100 20 L0 20 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* Settings */
function Settings() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-purple-700 mb-2 sm:mb-4">
        Settings
      </h2>
      <p className="text-gray-500">Admin settings will appear here.</p>
    </div>
  );
}
