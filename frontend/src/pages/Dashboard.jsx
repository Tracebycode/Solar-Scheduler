import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/state";

export default function Dashboard() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setState(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch state:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const intervalId = setInterval(fetchState, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem", background: "#1f1f1f", color: "#e8e8e8", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>Loading...</div>;
  }

  if (!state) {
    return <div style={{ padding: "2rem", background: "#1f1f1f", color: "#e8e8e8", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>Failed to load state</div>;
  }

  const batteryPercent = state.batteryCapacityWh > 0
    ? Math.round((state.batteryRemainingWh / state.batteryCapacityWh) * 100)
    : 0;

  return (
    <div style={{ background: "#1f1f1f", color: "#e8e8e8", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header Bar */}
      <div style={{ background: "#2a2a2a", padding: "1.5rem 2rem", borderBottom: "1px solid #3a3a3a", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "600", color: "#f5f5f5" }}>Solar Energy Scheduler</h1>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "1rem", color: "#c0c0c0" }}>Next 15-Minute Decision Window</p>
      </div>

      <div style={{ padding: "2.5rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Summary Cards */}
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {/* Battery Status Card */}
          <div style={{ 
            flex: "1", 
            minWidth: "250px", 
            background: "#2d2d2d", 
            padding: "2rem", 
            borderRadius: "8px", 
            border: "1px solid #3d3d3d",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#d0d0d0", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>Battery Status</h3>
            <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "700", color: "#f5f5f5", lineHeight: "1.2" }}>
              {state.batteryRemainingWh.toFixed(1)} <span style={{ fontSize: "1.4rem", color: "#d0d0d0", fontWeight: "400" }}>/ {state.batteryCapacityWh} Wh</span>
            </p>
            <p style={{ margin: "0.75rem 0 0 0", fontSize: "1rem", color: "#d0d0d0" }}>{batteryPercent}% remaining</p>
          </div>

          {/* Solar Forecast Card */}
          <div style={{ 
            flex: "1", 
            minWidth: "250px", 
            background: "#2a2d2f", 
            padding: "2rem", 
            borderRadius: "8px", 
            border: "1px solid #3a4a4d",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#d0d0d0", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>Solar Forecast</h3>
            <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "700", color: "#f5f5f5", lineHeight: "1.2" }}>
              {state.solarForecastWh} <span style={{ fontSize: "1.4rem", color: "#d0d0d0", fontWeight: "400" }}>Wh</span>
            </p>
            <p style={{ margin: "0.75rem 0 0 0", fontSize: "1rem", color: "#d0d0d0" }}>Next 15 minutes</p>
          </div>

          {/* Energy Deficit Card */}
          <div style={{ 
            flex: "1", 
            minWidth: "250px", 
            background: state.energyDeficitWh > 0 ? "#3a2525" : "#2d2d2d", 
            padding: "2rem", 
            borderRadius: "8px", 
            border: state.energyDeficitWh > 0 ? "1px solid #6a4a4a" : "1px solid #3d3d3d",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#d0d0d0", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>Energy Deficit</h3>
            <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "700", color: state.energyDeficitWh > 0 ? "#d88a8a" : "#f5f5f5", lineHeight: "1.2" }}>
              {state.energyDeficitWh.toFixed(1)} <span style={{ fontSize: "1.4rem", color: "#d0d0d0", fontWeight: "400" }}>Wh</span>
            </p>
            <p style={{ margin: "0.75rem 0 0 0", fontSize: "1rem", color: state.energyDeficitWh > 0 ? "#d0a0a0" : "#d0d0d0" }}>
              {state.energyDeficitWh > 0 ? "⚠️ Insufficient energy" : "Sufficient energy"}
            </p>
          </div>
        </div>

        {/* Warnings */}
        {state.warnings && state.warnings.length > 0 && (
          <div style={{ 
            marginBottom: "2.5rem", 
            padding: "1.5rem 2rem", 
            background: "#2a2418", 
            border: "1px solid #6a5a3a",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", color: "#d8a868", fontWeight: "600" }}>⚠️ Warnings</h3>
            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
              {state.warnings.map((warning, index) => (
                <li key={index} style={{ color: "#e8c898", marginBottom: "0.75rem", fontSize: "1.05rem", fontWeight: "500" }}>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Time Window Section */}
        <div style={{ 
          marginBottom: "2.5rem", 
          padding: "1.5rem 2rem", 
          background: "#252525", 
          border: "1px solid #3d3d3d",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ margin: "0 0 1.25rem 0", fontSize: "1.2rem", color: "#f5f5f5", fontWeight: "600" }}>Time Window</h2>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#d0d0d0", fontWeight: "500" }}>Start Time</p>
              <p style={{ margin: 0, fontSize: "1.1rem", color: "#f5f5f5", fontWeight: "500" }}>{new Date(state.windowStart).toLocaleString()}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#d0d0d0", fontWeight: "500" }}>End Time</p>
              <p style={{ margin: 0, fontSize: "1.1rem", color: "#f5f5f5", fontWeight: "500" }}>{new Date(state.windowEnd).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Devices Table */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.3rem", color: "#f5f5f5", fontWeight: "600" }}>Devices</h2>
          <div style={{ 
            background: "#2d2d2d", 
            borderRadius: "8px", 
            border: "1px solid #3d3d3d",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#252525" }}>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#b0b0b0", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #3d3d3d" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#b0b0b0", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #3d3d3d" }}>Type</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#b0b0b0", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #3d3d3d" }}>Power (W)</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#b0b0b0", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #3d3d3d" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.devices.map((device, index) => (
                  <tr 
                    key={device.id} 
                    style={{ 
                      background: device.type === "CRITICAL" ? "#2a2a1a" : index % 2 === 0 ? "#2d2d2d" : "#252525",
                      borderBottom: index < state.devices.length - 1 ? "1px solid #3d3d3d" : "none"
                    }}
                  >
                    <td style={{ padding: "1rem", color: "#f5f5f5", fontSize: "1rem", fontWeight: "500" }}>{device.name}</td>
                    <td style={{ padding: "1rem", color: "#f5f5f5", fontSize: "1rem", fontWeight: "500" }}>{device.type}</td>
                    <td style={{ padding: "1rem", color: "#f5f5f5", fontSize: "1rem", fontWeight: "500" }}>{device.powerW}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        display: "inline-block",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "4px",
                        color: device.isOn ? "#2d5016" : "#6a6a6a",
                        background: device.isOn ? "#6a9a5a" : "#4a4a4a",
                        fontSize: "0.9rem", 
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {device.isOn ? "ON" : "OFF"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Info Footer */}
        <div style={{ 
          padding: "1rem 1.5rem", 
          background: "#252525", 
          border: "1px solid #3d3d3d",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "1rem", color: "#d0d0d0" }}>
              <span style={{ color: "#f5f5f5", fontWeight: "600" }}>Override Mode:</span> <span style={{ color: "#f5f5f5", fontWeight: "500" }}>{state.overrideMode ? "Enabled" : "Disabled"}</span>
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "1rem", color: "#d0d0d0" }}>
              Last Updated: <span style={{ color: "#f5f5f5", fontWeight: "500" }}>{new Date().toLocaleTimeString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
