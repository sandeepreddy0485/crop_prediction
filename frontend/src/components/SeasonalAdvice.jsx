const SEASONAL_CROPS = {
  kharif:  { months: [6,7,8,9,10], crops: ["rice","maize","cotton","soybean","groundnut","sugarcane"], season: "Kharif (Monsoon)" },
  rabi:    { months: [11,12,1,2,3], crops: ["wheat","mustard","chickpea","lentil","peas","barley"],   season: "Rabi (Winter)" },
  zaid:    { months: [3,4,5,6],    crops: ["watermelon","muskmelon","cucumber","moong","sunflower"],  season: "Zaid (Summer)" },
}

export default function SeasonalAdvice({ region }) {
  const month = new Date().getMonth() + 1

  const currentSeason = Object.values(SEASONAL_CROPS).find((s) =>
    s.months.includes(month)
  ) || SEASONAL_CROPS.rabi

  const tips = {
    "Kharif (Monsoon)": "Ensure proper drainage. Monitor for fungal diseases due to high humidity.",
    "Rabi (Winter)":    "Irrigate regularly. Watch for frost in northern regions.",
    "Zaid (Summer)":    "Water frequently. Use mulching to retain soil moisture.",
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-amber-800 mb-3">
        📅 Current Season — {currentSeason.season}
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        Crops in season right now in <strong>{region || "your region"}</strong>:
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {currentSeason.crops.map((crop) => (
          <span
            key={crop}
            className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300 capitalize"
          >
            {crop}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-500 italic">
        💡 {tips[currentSeason.season]}
      </p>
    </div>
  )
}