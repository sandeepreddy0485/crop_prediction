import { useState } from "react"
import InputForm from "../components/InputForm"
import ResultCard from "../components/ResultCard"
import SeasonalAdvice from "../components/SeasonalAdvice"

export default function Home() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="animate-bounce inline-block mb-4">
            <span className="text-6xl drop-shadow-lg">🌾</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            CropSense
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ✨ <span className="font-bold">AI-powered Crop Intelligence</span> for Smart Farming
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Get personalized crop recommendations using AI, real-time weather & soil analysis
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "📌", title: "Select Field", text: "Choose your state, district and enter your field details." },
            { icon: "🌦️", title: "Auto Fetch Data", text: "Quickly load local weather and soil values based on your region." },
            { icon: "🚜", title: "Get Recommendation", text: "Receive the best crop recommendation and seasonal advice." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h2 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Input Form */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="transform transition hover:scale-105 duration-300">
              <InputForm onResult={setResult} onLoading={setLoading} />
            </div>
            <SeasonalAdvice region={result?.region} />
          </div>

          {/* Right Column — Result */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="flex items-center justify-center h-96 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-green-200">
                <div className="text-center">
                  <div className="animate-spin text-6xl mb-4">🌱</div>
                  <p className="text-lg font-bold text-gray-700">Analyzing your field...</p>
                  <p className="text-sm text-gray-500 mt-2">Using advanced AI models</p>
                  <div className="mt-4 flex justify-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="transform transition hover:scale-105 duration-300">
                <ResultCard result={result} />
              </div>
            )}

            {!loading && !result && (
              <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 rounded-3xl shadow-lg border-dashed border-green-200">                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">🌿</div>
                  <p className="text-2xl font-bold text-green-800 mb-2">Ready to recommend!</p>
                  <p className="text-gray-600 max-w-xs">
                    👈 Fill in your field details on the left to get AI-powered crop recommendations
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      <span className="text-sm font-semibold text-gray-700">Accurate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span className="text-sm font-semibold text-gray-700">Instant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌍</span>
                      <span className="text-sm font-semibold text-gray-700">Smart</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition">
            <p className="text-3xl font-black text-green-600">99.55%</p>
            <p className="text-gray-600 text-sm mt-1">Model Accuracy</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition">
            <p className="text-3xl font-black text-blue-600">22+</p>
            <p className="text-gray-600 text-sm mt-1">Crops Supported</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition">
            <p className="text-3xl font-black text-amber-600">All States</p>
            <p className="text-gray-600 text-sm mt-1">India Coverage</p>
          </div>
        </div>
      </div>
    </div>
  )
}