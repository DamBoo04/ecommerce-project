import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white text-black px-5 xl:px-12 py-4 flex justify-between items-center shadow-md z-50 transition-all">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold font-heading">
          Logo Here.
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex px-4 mx-auto font-semibold space-x-12">
          <li>
            <Link className="hover:text-gray-600" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-600" to="/category">
              Category
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-600" to="/collections">
              Collections
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-600" to="/contact">
              Contact Us
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-600" to="/profile">
              Profile
            </Link>
          </li>
        </ul>

        {/* Header Icons / Auth (Desktop) */}
        <div className="hidden xl:flex items-center space-x-5">
          {/* Favorites */}
          <Link to="#" className="hover:text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            to="#"
            className="relative flex items-center hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -mt-5 ml-4">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </Link>

          {!user ? (
            <Link to="/login" className="flex items-center hover:text-gray-600">
              <i className="fa-regular fa-user mr-1"></i> Sign in
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center font-semibold text-black gap-2"
              >
                <i className="fa-regular fa-user"></i> {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="xl:hidden flex items-center text-black z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 hover:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-md z-40">
          <ul className="flex flex-col gap-3 px-5 py-4">
            <li>
              <Link className="hover:text-gray-600" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600" to="/category">
                Category
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600" to="/collections">
                Collections
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600" to="/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600" to="/profile">
                Profile
              </Link>
            </li>
            {!user ? (
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-gray-600"
                >
                  <i className="fa-regular fa-user mr-1"></i> Sign in
                </Link>
              </li>
            ) : (
              <li className="flex flex-col gap-2">
                <span className="flex items-center font-semibold text-black gap-1">
                  <i className="fa-regular fa-user"></i> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
