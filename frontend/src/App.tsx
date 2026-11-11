import { useState } from "react";

const BACKEND: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Shape of the weather object returned by the Flask microservice (/weather).
interface Weather {
  suburb: string;
  condition: string;
  description: string;
  temp_c: number;
  note?: string; // only present when the OpenWeatherMap call failed
}

// The backend only ever recommends one of these three spot types.
type SpotType = "library" | "park" | "cafe";

// Shape of the response from the Flask backend (/api/recommend).
interface Recommendation {
  suburb: string;
  recommended_type: SpotType;
  reason: string;
  weather: Weather;
}

export default function App() {
  const [suburb, setSuburb] = useState<string>("");
  const [result, setResult] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/recommend?suburb=${encodeURIComponent(suburb)}`);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data: Recommendation = await res.json();
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h1>📚 StudySpot Finder</h1>
      <p style={{ color: "#666" }}>Find the best place to study based on today's weather.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <input
          value={suburb}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSuburb(e.target.value)}
          placeholder="Enter your suburb (e.g. Auckland)"
          style={{ flex: 1, padding: "10px 14px", fontSize: 15, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button onClick={search} style={{ padding: "10px 20px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontSize: 15 }}>
          Search
        </button>
      </div>

      {loading && <p style={{ marginTop: 24 }}>Loading...</p>}

      {error && <p style={{ marginTop: 24, color: "#b91c1c" }}>Could not get a recommendation: {error}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 20, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <p>🌤 <strong>{result.weather.description}</strong> · {result.weather.temp_c}°C</p>
          <p style={{ marginTop: 12 }}>📍 Recommended: <strong>{result.recommended_type}</strong></p>
          <p style={{ color: "#555" }}>{result.reason}</p>
        </div>
      )}
    </div>
  );
}
