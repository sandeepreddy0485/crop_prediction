import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { useState } from "react"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api"

export default function ResultCard({ result }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  
  // Determine color based on confidence
  const getColorScheme = (confidence) => {
    if (confidence >= 85) return {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-300",
      badge: "bg-gradient-to-r from-green-400 to-emerald-400",
      badgeText: "text-white",
      badgeLabel: "🔥 Excellent Fit",
      textColor: "text-green-800",
      accentColor: "text-green-600",
    }
    if (confidence >= 70) return {
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-300",
      badge: "bg-gradient-to-r from-blue-400 to-cyan-400",
      badgeText: "text-white",
      badgeLabel: "✅ Great Fit",
      textColor: "text-blue-800",
      accentColor: "text-blue-600",
    }
    if (confidence >= 55) return {
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-300",
      badge: "bg-gradient-to-r from-amber-400 to-orange-400",
      badgeText: "text-white",
      badgeLabel: "⚠️ Good Option",
      textColor: "text-amber-800",
      accentColor: "text-amber-600",
    }
    return {
      bg: "from-slate-50 to-gray-50",
      border: "border-slate-300",
      badge: "bg-gradient-to-r from-slate-400 to-gray-400",
      badgeText: "text-white",
      badgeLabel: "📊 Possible",
      textColor: "text-slate-800",
      accentColor: "text-slate-600",
    }
  }

  const colors = getColorScheme(result.confidence)

  const handleSave = async () => {
    try {
      await axios.post(
        `${API}/history/save`,
        result,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      setSaved(true)
    } catch {
      alert("Could not save. Are you logged in?")
    }
  }

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-3xl border-2 ${colors.border} shadow-2xl p-8 transform transition hover:shadow-3xl hover:scale-105 duration-300`}>
      
      {/* Header with Badge */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${colors.textColor}`}>🌾 Your Best Crop</h2>
          <p className="text-sm text-gray-500 mt-1">AI-powered prediction for optimal yield</p>
        </div>
        <div className={`${colors.badge} ${colors.badgeText} px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition`}>
          {colors.badgeLabel}
        </div>
      </div>

      {/* Main Crop Display - PREMIUM STYLE */}
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition duration-300">
        <div className="flex items-center justify-center mb-4">
          <span className="text-7xl animate-bounce">🌾</span>
        </div>
        <p className={`text-5xl font-black capitalize tracking-wider ${colors.textColor} drop-shadow-lg`}>
          {result.recommended_crop}
        </p>
        
        {/* Confidence Score */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                result.confidence >= 85 ? "from-green-400 to-emerald-500" :
                result.confidence >= 70 ? "from-blue-400 to-cyan-500" :
                result.confidence >= 55 ? "from-amber-400 to-orange-500" :
                "from-slate-400 to-gray-500"
              } transition-all duration-500`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
          <div className={`text-right font-bold text-2xl ${colors.accentColor}`}>
            {result.confidence}%
          </div>
        </div>
        <p className="text-gray-500 mt-3 text-sm">Confidence Score</p>
      </div>

      {/* Top Alternatives */}
      <div className="mb-6">
        <p className={`text-sm font-bold uppercase tracking-wider ${colors.textColor} mb-3 flex items-center gap-2`}>
          <span className="text-lg">🥇</span> Alternative Options
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.top_alternatives.map((alt, idx) => (
            <div
              key={alt.crop}
              className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:shadow-lg hover:scale-105 transition duration-300 transform"
            >
              <div className="text-3xl mb-2">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </div>
              <p className="font-bold text-gray-800 capitalize">{alt.crop}</p>
              <p className={`text-sm font-semibold mt-1 ${colors.accentColor}`}>
                {alt.confidence}% match
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Yield & Price Info */}
      {result.yield_estimate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Yield Estimate */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">📦</span>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Yield Estimate</p>
            </div>
            <p className="text-3xl font-black text-green-700">
              {result.yield_estimate.quintals}
            </p>
            <p className="text-xs text-gray-500 mt-2">quintals per acre</p>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💰</span>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Price Range</p>
            </div>
            <p className="text-3xl font-black text-blue-700">
              {result.yield_estimate.price_range}
            </p>
            <p className="text-xs text-gray-500 mt-2">per quintal (₹)</p>
          </div>
        </div>
      )}

      {/* Seasonal Advice */}
      {result.seasonal_advice && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📅</span>
            <p className="text-sm font-bold text-purple-800 uppercase tracking-wider">Best Season</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(result.seasonal_advice).map(([season, active]) => (
              <div
                key={season}
                className={`p-3 rounded-lg font-bold text-center text-sm transition transform hover:scale-105 ${
                  active
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {season === "kharif" ? "🌾 Kharif" : season === "rabi" ? "🌾 Rabi" : "🌾 Zaid"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {user && (
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
            saved
              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-xl"
          }`}
        >
          {saved ? "✅ Saved Successfully!" : "💾 Save to My History"}
        </button>
      )}

      {!user && (
        <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-4 text-center">
          <p className="text-blue-800 font-semibold">
            🔐 Please login to save your predictions
          </p>
        </div>
      )}
    </div>
  )
}