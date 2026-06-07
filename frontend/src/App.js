import { useState } from "react";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function App() {
  const [suburb, setSuburb] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND}/api/recommend?suburb=${suburb}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h1>📚 StudySpot Finder</h1>
      <p style={{ color: "#666" }}>Find the best place to study based on today's weather.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <input
          value={suburb}
          onChange={e => setSuburb(e.target.value)}
          placeholder="Enter your suburb (e.g. Auckland)"
          style={{ flex: 1, padding: "10px 14px", fontSize: 15, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button onClick={search} style={{ padding: "10px 20px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontSize: 15 }}>
          Search
        </button>
      </div>

      {loading && <p style={{ marginTop: 24 }}>Loading...</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 20, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <p>🌤 <strong>{result.weather?.description}</strong> · {result.weather?.temp_c}°C</p>
          <p style={{ marginTop: 12 }}>📍 Recommended: <strong>{result.recommended_type}</strong></p>
          <p style={{ color: "#555" }}>{result.reason}</p>
        </div>
      )}
    </div>
  );
}