import { useState } from "react"
import axios from "axios"
import { DISTRICT_SOIL_MICRONUTRIENTS } from "../data/districtSoilData"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api"

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

const FIELD_STYLE = {
  emerald: { border: "border-emerald-200", text: "text-emerald-600" },
  yellow: { border: "border-yellow-200", text: "text-yellow-600" },
  orange: { border: "border-orange-200", text: "text-orange-600" },
  purple: { border: "border-purple-200", text: "text-purple-600" },
  red: { border: "border-red-200", text: "text-red-600" },
  blue: { border: "border-blue-200", text: "text-blue-600" },
  cyan: { border: "border-cyan-200", text: "text-cyan-600" },
}

const WEATHER_STYLE = {
  red: { border: "border-red-200", text: "text-red-600" },
  blue: { border: "border-blue-200", text: "text-blue-600" },
  cyan: { border: "border-cyan-200", text: "text-cyan-600" },
}

const defaultInputs = {
  N: "", P: "", K: "", temperature: "",
  humidity: "", ph: "", rainfall: "",
  area: "", region: "Telangana", Zn: "", Fe: "", Cu: "", Mn: "", B: "", S: ""
}

export default function InputForm({ onResult, onLoading }) {
  const [mode, setMode] = useState("location")
  const [inputs, setInputs] = useState(defaultInputs)
  const [district, setDistrict] = useState("")
  const [error, setError] = useState("")
  const [statusMsg, setStatusMsg] = useState("")
  const [fetching, setFetching] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [districtFilter, setDistrictFilter] = useState("")

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

  const filteredDistricts = (STATE_DISTRICTS_MAP[inputs.region] || [])
    .filter((name) => name.toLowerCase().includes(districtFilter.toLowerCase()))

  const getStyle = (color) => FIELD_STYLE[color] || FIELD_STYLE.emerald

  const nutrientStatus = (value) => {
    if (value === "" || value === null || isNaN(Number(value))) return "Unknown"
    const number = Number(value)
    if (number <= 120) return "Low"
    if (number <= 220) return "Good"
    return "High"
  }

  const getSoilTip = () => {
    if (!inputs.ph) return "Enter pH to get soil advice."
    const phValue = Number(inputs.ph)
    if (phValue < 6.0) return "Soil is acidic; consider applying lime."
    if (phValue > 8.0) return "Soil is alkaline; consider gypsum for balance."
    return "Soil pH is balanced for most crops."
  }

  const handleReset = () => {
    setInputs(defaultInputs)
    setDistrict("")
    setDistrictFilter("")
    setError("")
    setStatusMsg("")
    setAutoFilled(false)
  }

  const handleGetWeather = async () => {
    if (!inputs.region || !district) {
      setStatusMsg("⚠️ Please select your state and district first.")
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
        `https://api.openweathermap.org/data/2.5/weather?q=${district}&appid=${apiKey}&units=metric`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City/Village not found. Try nearest town.")
        }
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      
      setInputs((prev) => ({
        ...prev,
        temperature: Math.round(data.main.temp * 10) / 10,
        humidity: data.main.humidity,
        rainfall: Math.round((data.clouds?.all || 0) * 2.5),
      }))

      setStatusMsg(`✅ Real-time weather fetched for ${data.name}!`)
    } catch (err) {
      console.error("Weather fetch error:", err)
      setStatusMsg(`❌ ${err.message}`)
    } finally {
      setFetching(false)
    }
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
      const selectedRegion = inputs.region || "Telangana"
      const stateSoil = STATE_SOIL_DEFAULTS[selectedRegion] || STATE_SOIL_DEFAULTS["Telangana"]
      const districtSoil = DISTRICT_SOIL_MICRONUTRIENTS[district] || {}

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
      setStatusMsg(`✅ Soil data loaded for ${district}!`)
    } catch (e) {
      console.error('handleLocationFill error:', e)
      setStatusMsg("❌ Unable to load soil data. Try again.")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    onLoading(true)
    try {
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-2xl px-8 py-8 text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
          🌾 Smart Crop Advisor
        </h2>
        <p className="text-emerald-100 text-lg">Get AI-powered crop recommendations based on your field conditions</p>
      </div>

      {/* Mode Selection - Cards */}
      <div className="bg-white px-8 py-8 border-t-4 border-emerald-600">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Step 1: Choose Your Input Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => { setMode("location"); setStatusMsg(""); setAutoFilled(false) }}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
              mode === "location"
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
            }`}
          >
            <p className="text-3xl mb-3">📍</p>
            <p className="font-bold text-gray-900 text-lg">Location-Based</p>
            <p className="text-sm text-gray-600 mt-1">Auto-fill from your district</p>
          </button>

          <button
            type="button"
            onClick={() => { setMode("manual"); setStatusMsg(""); setAutoFilled(false) }}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
              mode === "manual"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <p className="text-3xl mb-3">🧪</p>
            <p className="font-bold text-gray-900 text-lg">Manual Entry</p>
            <p className="text-sm text-gray-600 mt-1">Enter your own values</p>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`px-8 py-4 ${
          statusMsg.startsWith("✅")
            ? "bg-green-50 border-l-4 border-green-500 text-green-800"
            : "bg-red-50 border-l-4 border-red-500 text-red-800"
        }`}>
          <p className="font-medium">{statusMsg}</p>
        </div>
      )}

      {/* Location Mode */}
      {mode === "location" && (
        <div className="bg-white px-8 py-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Your Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🗺️ Select Your State</label>
                <select
                  name="region"
                  value={inputs.region}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-medium text-gray-700 transition"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Select Your District</label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-medium text-gray-700 transition"
                    >
                      <option value="">-- Select District --</option>
                      {filteredDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Search district</label>
                    <input
                      type="text"
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      placeholder="Type to filter districts"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-fill Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleLocationFill}
              disabled={fetching || !district.trim()}
              className={`py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                fetching || !district.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
              }`}
            >
              {fetching ? "🔄 Loading..." : "🌿 Load Soil Data"}
            </button>
            <button
              type="button"
              onClick={handleGetWeather}
              disabled={fetching || !district.trim()}
              className={`py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                fetching || !district.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {fetching ? "🔄 Fetching..." : "☁️ Fetch Weather"}
            </button>
          </div>

          {/* Display Auto-filled Data */}
          {autoFilled && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
              <p className="font-bold text-emerald-900 mb-4">✅ Auto-filled Field Data</p>
              
              {/* Macronutrients */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs">NPK</span>
                  Macronutrients (kg/ha)
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: "🌿", label: "N", key: "N", color: "emerald" },
                    { icon: "💛", label: "P", key: "P", color: "yellow" },
                    { icon: "⭐", label: "K", key: "K", color: "orange" },
                    { icon: "🧪", label: "pH", key: "ph", color: "purple" },
                  ].map((item) => {
                    const style = getStyle(item.color)
                    return (
                      <div key={item.key} className={`bg-white rounded-lg p-3 text-center ${style.border}`}>
                        <p className="text-2xl mb-1">{item.icon}</p>
                        <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                        <p className={`text-lg font-bold ${style.text} mt-1`}>{inputs[item.key]}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weather Data */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">WEATHER</span>
                  Real-time Data
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "🌡️", label: "Temperature", key: "temperature", unit: "°C", style: WEATHER_STYLE.red },
                    { icon: "💧", label: "Humidity", key: "humidity", unit: "%", style: WEATHER_STYLE.blue },
                    { icon: "🌧️", label: "Rainfall", key: "rainfall", unit: "mm", style: WEATHER_STYLE.cyan },
                  ].map((item) => (
                    <div key={item.key} className={`bg-white rounded-lg p-3 text-center ${item.style.border}`}>
                      <p className="text-2xl mb-1">{item.icon}</p>
                      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                      <p className={`text-lg font-bold ${item.style.text} mt-1`}>{inputs[item.key]} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Field Area</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="area"
                value={inputs.area}
                onChange={handleChange}
                placeholder="e.g., 2.5"
                min="0.1"
                step="0.1"
                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-medium transition"
              />
              <span className="flex items-center px-4 bg-gray-100 rounded-lg font-semibold text-gray-700">Acres</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">🌟 Quick Soil Tip</p>
            <p className="text-sm text-slate-600">{getSoilTip()}</p>
          </div>
        </div>
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div className="bg-white px-8 py-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Soil Test Report Values
            </h3>
            <p className="text-sm text-gray-600 mb-4">👉 Values from your latest soil analysis</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Nitrogen (N)", name: "N", unit: "kg/ha", color: "green" },
                { label: "Phosphorus (P)", name: "P", unit: "kg/ha", color: "yellow" },
                { label: "Potassium (K)", name: "K", unit: "kg/ha", color: "orange" },
                { label: "pH Level", name: "ph", unit: "", color: "purple" },
                { label: "Temperature", name: "temperature", unit: "°C", color: "red" },
                { label: "Humidity", name: "humidity", unit: "%", color: "blue" },
                { label: "Rainfall", name: "rainfall", unit: "mm", color: "cyan" },
                { label: "Zinc (Zn)", name: "Zn", unit: "%", color: "orange" },
                { label: "Iron (Fe)", name: "Fe", unit: "%", color: "red" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{field.label}</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      name={field.name}
                      value={inputs[field.name]}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.1"
                      className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-sm transition"
                    />
                    <span className="flex items-center text-xs font-semibold text-gray-600 px-2 bg-gray-50 rounded-lg whitespace-nowrap">{field.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Your Location & Field Size
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🗺️ State</label>
                <select
                  name="region"
                  value={inputs.region}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 transition"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Field Area (Acres)</label>
                <input
                  type="number"
                  name="area"
                  value={inputs.area}
                  onChange={handleChange}
                  placeholder="e.g., 2.5"
                  min="0.1"
                  step="0.1"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium transition"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 px-8 py-4">
          <p className="text-red-800 font-semibold">❌ Error: {error}</p>
        </div>
      )}

      {/* Submit and Reset */}
      <div className="bg-white px-8 py-6 border-t-2 border-gray-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          className="w-full md:w-auto py-4 px-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg rounded-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          🚀 Get Crop Recommendation
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full md:w-auto py-4 px-8 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold transition hover:bg-slate-100"
        >
          ♻️ Reset Form
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          ✨ Powered by AI | 99.55% Accuracy | Data from Indian Agricultural Research Institute
        </p>
      </div>
    </form>
  )
}