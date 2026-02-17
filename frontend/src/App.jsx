import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Products from "./pages/admin/ProductsList";
import Brands from "./pages/admin/BrandsList";
import Users from "./pages/admin/Users";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar for non-admin users */}
        {!isAdmin && <Navbar />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* User Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute adminOnly={false}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/brands"
              element={
                <ProtectedRoute adminOnly>
                  <Brands />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer for non-admin users */}
        {!isAdmin && <Footer />}
      </div>
    </Router>
  );
}

export default App;
