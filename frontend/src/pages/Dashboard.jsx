import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api"

const SUITABILITY_COLOR = {
  high:     "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  low:      "bg-red-100 text-red-700",
}

export default function Dashboard() {
  const { user }                    = useAuth()
  const [predictions, setPredictions] = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)

  const headers = { Authorization: `Bearer ${user.token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([
          axios.get(`${API}/history/`, { headers }),
          axios.get(`${API}/history/stats`, { headers }),
        ])
        setPredictions(histRes.data.predictions)
        setStats(statsRes.data)
      } catch {
        console.error("Failed to load history")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/history/${id}`, { headers })
      setPredictions(predictions.filter((p) => p._id !== id))
    } catch {
      alert("Could not delete")
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400 animate-pulse">Loading your history...</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">📊 My Prediction History</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.total_predictions}</p>
            <p className="text-sm text-gray-500">Total Predictions</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700 capitalize">{stats.most_recommended || "—"}</p>
            <p className="text-sm text-gray-500">Most Recommended</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-700">
              {stats.by_crop[0]?.avg_confidence || "—"}%
            </p>
            <p className="text-sm text-gray-500">Avg Confidence</p>
          </div>
        </div>
      )}

      {/* Table */}
      {predictions.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🌿</p>
          <p>No predictions yet. Go to Home and make your first prediction!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-green-50 text-green-800">
              <tr>
                {["Crop","Confidence","Suitability","Region","Date",""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium capitalize">{p.recommended_crop}</td>
                  <td className="px-4 py-3">{p.confidence}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SUITABILITY_COLOR[p.suitability]}`}>
                      {p.suitability}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.region || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}