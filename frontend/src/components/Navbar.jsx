import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [lang, setLang] = useState("en")

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="relative">
            <span className="text-4xl">🌾</span>
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-700">CropSense</span>
            <span className="text-xs text-gray-500 font-semibold">Smart Farming</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link to="/" className="text-gray-700 hover:text-emerald-600 font-semibold transition text-sm flex items-center gap-1">
            <span>🏠</span>
            {lang === "en" ? "Home" : "होम"}
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 font-semibold transition text-sm flex items-center gap-1">
              <span>📊</span>
              {lang === "en" ? "History" : "इतिहास"}
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold transition"
          >
            {lang === "en" ? "हिंदी" : "EN"}
          </button>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-emerald-700">👤 {user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}