import { useState } from "react"
import axios from "axios"
import { DISTRICT_SOIL_MICRONUTRIENTS } from "../data/districtSoilData"

const API = "http://127.0.0.1:5000/api"

const STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
]

const STATE_SOIL_DEFAULTS = {
  "Andhra Pradesh":   { N: 280, P: 18, K: 180, ph: 7.2 },
  "Assam":            { N: 320, P: 22, K: 150, ph: 5.8 },
  "Bihar":            { N: 240, P: 16, K: 200, ph: 7.8 },
  "Chhattisgarh":     { N: 260, P: 14, K: 160, ph: 6.5 },
  "Gujarat":          { N: 220, P: 20, K: 190, ph: 7.9 },
  "Haryana":          { N: 280, P: 24, K: 210, ph: 8.0 },
  "Himachal Pradesh": { N: 300, P: 18, K: 170, ph: 6.2 },
  "Jharkhand":        { N: 240, P: 12, K: 140, ph: 5.9 },
  "Karnataka":        { N: 260, P: 20, K: 175, ph: 6.8 },
  "Kerala":           { N: 310, P: 16, K: 145, ph: 5.7 },
  "Madhya Pradesh":   { N: 250, P: 18, K: 185, ph: 7.5 },
  "Maharashtra":      { N: 270, P: 22, K: 195, ph: 7.3 },
  "Manipur":          { N: 290, P: 14, K: 130, ph: 5.6 },
  "Meghalaya":        { N: 300, P: 16, K: 135, ph: 5.4 },
  "Mizoram":          { N: 285, P: 13, K: 128, ph: 5.5 },
  "Nagaland":         { N: 295, P: 15, K: 132, ph: 5.7 },
  "Odisha":           { N: 255, P: 17, K: 155, ph: 6.3 },
  "Punjab":           { N: 290, P: 26, K: 220, ph: 7.9 },
  "Rajasthan":        { N: 210, P: 15, K: 175, ph: 8.2 },
  "Sikkim":           { N: 305, P: 19, K: 142, ph: 5.8 },
  "Tamil Nadu":       { N: 275, P: 21, K: 172, ph: 7.0 },
  "Telangana":        { N: 268, P: 19, K: 178, ph: 7.1 },
  "Tripura":          { N: 288, P: 15, K: 138, ph: 5.9 },
  "Uttar Pradesh":    { N: 260, P: 20, K: 205, ph: 7.8 },
  "Uttarakhand":      { N: 295, P: 17, K: 165, ph: 6.4 },
  "West Bengal":      { N: 300, P: 19, K: 158, ph: 6.1 },
}

// State-to-Districts mapping
const STATE_DISTRICTS_MAP = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Nellore", "Srikakulam", "Visakhapatanam", "Vizianagaram", "West Godavari", "Y.S.R.",
    "Alluri Sitharama Raju", "Anakapalli", "Bapatla", "Eluru", "Kakinada", "Dr. B. R. Ambedkar Konaseema", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Sri Balaji", "Sri Sathya Sai", "Tirupati"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "HOJAI", "Jorhat", "Kamrup", "Kamrup Metro", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Marigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "SOUTH SALMARA MANCACHAR", "Tinsukia", "Udalguri",
    "Bajali", "Tamulpur", "West Karbi Anglong"
  ],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Pashchim Champaran", "Patna", "Purbi Champaran", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali"],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariyaband", "Janjgir-Champa", "Jashpur", "KABIRDHAM", "Kanker", "Kondagaon", "Korba", "Korea", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja",
    "Gaurela-Pendra-Marwahi", "Khairagarh-Chhuikhadan-Gandai", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Sakti", "Sarangarh-Bilaigarh"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "S.A.S Nagar", "Sangrur", "Tarn Taran",
    "Malerkotla"
  ],
  "Karnataka": [
    "Bangalore", "Mysore", "Kolar", "Tumkur", "Mandya", "Hassan", "Chikmagalur", "Udupi", "Kodagu", "Dakshina Kannad",
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bidar", "Chamarajanagar", "Chikkaballapur", "Davanagere", "Dharwad", "Gadag", "Haveri", "Kalaburagi", "Koppal", "Raichur", "Ramanagara", "Shivamogga", "Uttara Kannada", "Vijayapura", "Yadgir", "Vijayanagara"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Khammam", "Nizamabad", "Karimnagar", "Adilabad", "Medak", "Nalgonda", "Rangareddi", "Mahbubnagar",
    "Bhadradri Kothagudem", "Hanamkonda", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Komaram Bheem Asifabad", "Mahabubabad", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Narayanpet", "Nirmal", "Peddapalli", "Rajanna Sircilla", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Yadadri Bhuvanagiri"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruppur", "Vellore", "Erode",
    "Ariyalur", "Chengalpattu", "Cuddalore", "Dharmapuri", "Dindigul", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Viluppuram", "Virudhunagar"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Ghaziabad", "Aligarh", "Mathura", "Bareilly",
    "Agra", "Aligarh", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddh Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Jyotiba Phule Nagar", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "West Bengal": [
    "Kolkata", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Nadia", "Murshidabad", "Maldah", "Birbhum",
    "Alipurduar", "Bankura", "Dakshin Dinajpur", "Hooghly", "Howrah", "Jhargram", "Kalimpong", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
}

const defaultInputs = {
  N: "", P: "", K: "", temperature: "",
  humidity: "", ph: "", rainfall: "",
  area: "", region: "Andhra Pradesh", Zn: "", Fe: "", Cu: "", Mn: "", B: "", S: ""
}

export default function InputForm({ onResult, onLoading }) {
  const [mode, setMode] = useState("location")
  const [inputs, setInputs] = useState(defaultInputs)
  const [district, setDistrict] = useState("")
  const [error, setError] = useState("")
  const [statusMsg, setStatusMsg] = useState("")
  const [fetching, setFetching] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
    if (e.target.name === "region") {
      setDistrict("")
      setStatusMsg("")
      setAutoFilled(false)
    }
  }

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value)
    setStatusMsg("")
  }

  const handleLocationFill = async () => {
    if (!district.trim()) {
      setStatusMsg("⚠️ Please select your district.")
      return
    }

    setFetching(true)
    setStatusMsg("")
    setAutoFilled(false)

    try {
      const selectedRegion = inputs.region || "Andhra Pradesh"
      const stateSoil = STATE_SOIL_DEFAULTS[selectedRegion] || STATE_SOIL_DEFAULTS["Andhra Pradesh"]
      const districtSoil = DISTRICT_SOIL_MICRONUTRIENTS[district] || {}

      // Prefer district-level macronutrients/ph when present in district data; otherwise fall back to state defaults
      const N_val = districtSoil.N !== undefined ? districtSoil.N : stateSoil.N
      const P_val = districtSoil.P !== undefined ? districtSoil.P : stateSoil.P
      const K_val = districtSoil.K !== undefined ? districtSoil.K : stateSoil.K
      const ph_val = districtSoil.ph !== undefined ? districtSoil.ph : stateSoil.ph

      setInputs((prev) => ({
        ...prev,
        N: N_val,
        P: P_val,
        K: K_val,
        ph: ph_val,
        temperature: prev.temperature || "",
        humidity: prev.humidity || "",
        rainfall: prev.rainfall || "",
        Zn: districtSoil.Zn !== undefined ? districtSoil.Zn : prev.Zn || 0,
        Fe: districtSoil.Fe !== undefined ? districtSoil.Fe : prev.Fe || 0,
        Cu: districtSoil.Cu !== undefined ? districtSoil.Cu : prev.Cu || 0,
        Mn: districtSoil.Mn !== undefined ? districtSoil.Mn : prev.Mn || 0,
        B: districtSoil.B !== undefined ? districtSoil.B : prev.B || 0,
        S: districtSoil.S !== undefined ? districtSoil.S : prev.S || 0,
      }))

      setAutoFilled(true)
      setStatusMsg(`✅ District data loaded for ${district}!`)
    } catch (e) {
      console.error('handleLocationFill error:', e)
      setStatusMsg("❌ Unable to load district data. Please try again.")
    } finally {
      setFetching(false)
    }
  }

  const handleGetWeather = async () => {
    const city = inputs.region || "Hyderabad"
    if (!city.trim()) {
      setStatusMsg("⚠️ Please select a state.")
      return
    }

    setFetching(true)
    setStatusMsg("")

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      if (!apiKey) {
        throw new Error("Weather API key not configured")
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please enter a valid city name.")
        }
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      
      setInputs((prev) => ({
        ...prev,
        temperature: Math.round(data.main.temp * 10) / 10,
        humidity: data.main.humidity,
        rainfall: data.clouds?.all || 0,
      }))

      setStatusMsg(`✅ Weather fetched for ${data.name}!`)
    } catch (err) {
      console.error("Weather fetch error:", err)
      setStatusMsg(`❌ ${err.message}`)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    onLoading(true)
    try {
      // Basic validation: ensure required features are present and numeric
      const required = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
      for (let key of required) {
        const val = inputs[key]
        if (val === "" || val === null || isNaN(Number(val))) {
          throw new Error(`Please provide a valid numeric value for ${key}`)
        }
      }

      const payload = {
        N: Number(inputs.N),
        P: Number(inputs.P),
        K: Number(inputs.K),
        temperature: Number(inputs.temperature),
        humidity: Number(inputs.humidity),
        ph: Number(inputs.ph),
        rainfall: Number(inputs.rainfall),
        area: Number(inputs.area) || 1,
        region: inputs.region,
        district,
        Zn: Number(inputs.Zn) || 0,
        Fe: Number(inputs.Fe) || 0,
        Cu: Number(inputs.Cu) || 0,
        Mn: Number(inputs.Mn) || 0,
        B: Number(inputs.B) || 0,
        S: Number(inputs.S) || 0,
      }

      const res = await axios.post(`${API}/predict`, payload)
      onResult(res.data)
    } catch (err) {
      let msg = "Something went wrong. Is the Flask server running?"
      // axios errors have response.data
      if (err && err.response && err.response.data) {
        const data = err.response.data
        if (data.error) msg = `${data.error}`
        else if (data.message) msg = `${data.message}`
      } else if (err && err.message) {
        msg = err.message
      }
      setError(msg)
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-7 border border-green-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">🌾 Predict Your Crop</h2>
        <p className="text-sm text-gray-500">AI-powered recommendation for your field</p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setMode("location"); setStatusMsg(""); setAutoFilled(false) }}
            className={`rounded-xl p-4 border-2 text-left transition duration-300 transform hover:scale-105 ${
              mode === "location"
                ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md"
                : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            <p className="text-2xl mb-2">📍</p>
            <p className="font-bold text-gray-800">Use My District</p>
            <p className="text-xs text-gray-500 mt-1">Select state & district</p>
          </button>

          <button
            type="button"
            onClick={() => { setMode("manual"); setStatusMsg(""); setAutoFilled(false) }}
            className={`rounded-xl p-4 border-2 text-left transition duration-300 transform hover:scale-105 ${
              mode === "manual"
                ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md"
                : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            <p className="text-2xl mb-2">🧪</p>
            <p className="font-bold text-gray-800">Manual Entry</p>
            <p className="text-xs text-gray-500 mt-1">Enter your soil data</p>
          </button>
        </div>
      </div>

      {mode === "location" && (
        <div className="bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-green-800 mb-1">📍 Enter Your Location</p>
          <p className="text-xs text-gray-600 mb-4">Select your state and district - we'll auto-fill soil micronutrients based on the district</p>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">🗺️ Select Your State</label>
            <select
              name="region"
              value={inputs.region}
              onChange={handleChange}
              className="w-full border-2 border-green-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-gray-700 hover:border-green-400 transition"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">📍 Select District</label>
            <div className="flex gap-2">
              <select
                value={district}
                onChange={handleDistrictChange}
                className="flex-1 border-2 border-green-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-gray-700 hover:border-green-400 transition"
              >
                <option value="">-- Select District --</option>
                {(STATE_DISTRICTS_MAP[inputs.region] || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleLocationFill}
                disabled={fetching || !district.trim()}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 transform hover:scale-105 ${
                  fetching || !district.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                }`}
              >
                {fetching ? "🔄" : "🔍"}
              </button>
            </div>
          </div>

          {statusMsg && (
            <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${
              statusMsg.startsWith("✅")
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              {statusMsg}
            </div>
          )}

          {autoFilled && (
            <div className="bg-white border-2 border-green-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-bold text-green-800 mb-3">✅ Auto-filled Soil & Micronutrient Data</p>
              
              {/* Macronutrients Row */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">🌿 Macronutrients (kg/ha)</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "🌿", label: "N", key: "N" },
                    { icon: "💛", label: "P", key: "P" },
                    { icon: "⭐", label: "K", key: "K" },
                    { icon: "🧪", label: "pH", key: "ph" },
                  ].map((item) => (
                    <div key={item.key} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2 text-center">
                      <p className="text-lg">{item.icon}</p>
                      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                      <p className="text-sm font-bold text-green-600">{inputs[item.key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Row */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">🌡️ Weather Data</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "🌡️", label: "Temp", key: "temperature", unit: "°C" },
                    { icon: "💧", label: "Humidity", key: "humidity", unit: "%" },
                    { icon: "🌧️", label: "Rainfall", key: "rainfall", unit: "mm" },
                  ].map((item) => (
                    <div key={item.key} className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2 text-center">
                      <p className="text-lg">{item.icon}</p>
                      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                      <p className="text-sm font-bold text-blue-600">{inputs[item.key]} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients Row */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">🧬 District Micronutrients (%)</p>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { label: "Zn", key: "Zn", cardClass: "from-orange-50 to-orange-100 border-orange-200", textClass: "text-orange-600" },
                    { label: "Fe", key: "Fe", cardClass: "from-red-50 to-red-100 border-red-200", textClass: "text-red-600" },
                    { label: "Cu", key: "Cu", cardClass: "from-yellow-50 to-yellow-100 border-yellow-200", textClass: "text-yellow-600" },
                    { label: "Mn", key: "Mn", cardClass: "from-purple-50 to-purple-100 border-purple-200", textClass: "text-purple-600" },
                    { label: "B", key: "B", cardClass: "from-pink-50 to-pink-100 border-pink-200", textClass: "text-pink-600" },
                    { label: "S", key: "S", cardClass: "from-indigo-50 to-indigo-100 border-indigo-200", textClass: "text-indigo-600" },
                  ].map((item) => (
                    <div key={item.key} className={`bg-gradient-to-br ${item.cardClass} rounded-lg p-2 text-center`}>
                      <p className="text-xs font-bold text-gray-700">{item.label}</p>
                      <p className={`text-sm font-bold ${item.textClass}`}>{parseFloat(inputs[item.key]) ? parseFloat(inputs[item.key]).toFixed(1) : "0.0"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">🌡️ Weather Data</label>
            <p className="text-xs text-gray-600 mb-3">Auto-fetch temperature & humidity from your state</p>
            <button
              type="button"
              onClick={handleGetWeather}
              disabled={fetching}
              className={`w-full px-6 py-3 rounded-lg text-white font-semibold transition duration-300 mb-4 ${
                fetching
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md"
              }`}
            >
              {fetching ? "🔄 Fetching..." : "☁️ Get Weather Data"}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">📏 Field Area (acres)</label>
            <input
              type="number"
              name="area"
              value={inputs.area}
              onChange={handleChange}
              placeholder="e.g., 2"
              min="0.1"
              step="0.1"
              className="w-full border-2 border-green-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-medium hover:border-green-400 transition"
            />
          </div>
        </div>
      )}

      {mode === "manual" && (
        <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-blue-800 mb-1">🧪 Enter Your Field Data</p>
          <p className="text-xs text-gray-600 mb-4">Input values from your soil test report</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Nitrogen (N)", name: "N", unit: "kg/ha" },
              { label: "Phosphorus (P)", name: "P", unit: "kg/ha" },
              { label: "Potassium (K)", name: "K", unit: "kg/ha" },
              { label: "pH Level", name: "ph", unit: "" },
              { label: "Temperature", name: "temperature", unit: "°C" },
              { label: "Humidity", name: "humidity", unit: "%" },
              { label: "Rainfall", name: "rainfall", unit: "mm" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{field.label}</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    name={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    placeholder="0"
                    className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium hover:border-blue-400 transition"
                  />
                  <span className="flex items-center text-xs font-semibold text-gray-600 px-2">{field.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">🗺️ Select Your State</label>
            <select
              name="region"
              value={inputs.region}
              onChange={handleChange}
              className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-gray-700 hover:border-blue-400 transition"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">📏 Field Area (acres)</label>
            <input
              type="number"
              name="area"
              value={inputs.area}
              onChange={handleChange}
              placeholder="e.g., 2"
              min="0.1"
              step="0.1"
              className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium hover:border-blue-400 transition"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg"
      >
        🚀 Get Crop Recommendation
      </button>

      {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
    </form>
  )
}
