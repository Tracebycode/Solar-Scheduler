import { useEffect, useState } from "react";
import BatteryBar from "../components/BatteryBar";
import ForecastCard from "../components/ForecastCard";
import OverrideToggle from "../components/OverrideToggle";
import DeviceCard from "../components/DeviceCard";
import SolarChart from "../components/SolarChart";
import GanttTimeline from "../components/GanttTimeline";

import {
  getState,
  toggleDevice,
  setOverride as setOverrideApi,
  get24hForecast
} from "../services/api";


export default function Dashboard() {

  /* ===============================
     STATES
  =============================== */

  const [battery, setBattery] = useState(0);
  const [forecast, setForecast] = useState(0);
  const [overrideMode, setOverrideMode] = useState(false);
  const [devices, setDevices] = useState([]);
  const [chartData, setChartData] = useState([]);


  /* ===============================
     FETCH STATE
  =============================== */

  const fetchState = async () => {
    try {
      const res = await getState();
      const data = res?.data || {};

      const percent =
        (data.batteryRemainingWh / data.batteryCapacityWh) * 100;

      setBattery(Math.round(percent));
      setForecast(data.lastSolarForecastWh ?? 0);
      setDevices(data.devices ?? []);
      setOverrideMode(data.overrideMode ?? false);

    } catch {
      console.log("API fallback");
    }
  };


  /* ===============================
     FETCH 24H FORECAST
  =============================== */

  const fetch24hForecast = async () => {
    try {
      const res = await get24hForecast();
      const data = res?.data?.forecast || [];
      setChartData(data);
    } catch {
      console.log("Forecast fallback");
    }
  };


  /* ===============================
     POLLING
  =============================== */

  useEffect(() => {
    fetchState();
    fetch24hForecast();
    const id = setInterval(fetchState, 8000);
    return () => clearInterval(id);
  }, []);


  /* ===============================
     TOGGLE
  =============================== */

  const toggleDeviceLocal = async (id, newState) => {
    await toggleDevice(id, newState);

    setDevices(prev =>
      prev.map(d =>
        d.id === id ? { ...d, isOn: newState } : d
      )
    );
  };


  /* ===============================
     OVERRIDE TOGGLE
  =============================== */

  const handleOverrideToggle = async (newMode) => {
    try {
      await setOverrideApi(newMode);
      setOverrideMode(newMode);
    } catch (error) {
      console.error("Failed to set override mode:", error);
    }
  };


  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <OverrideToggle
          override={overrideMode}
          setOverride={handleOverrideToggle}
        />
      </div>

      {/* TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BatteryBar percent={battery} />
        <ForecastCard value={forecast} />
      </div>

      {/* CHART */}
      <SolarChart data={chartData} />

      {/* TIMELINE */}
      <GanttTimeline devices={devices} forecast={chartData} />

      {/* DEVICE STATUS (Read Only) */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Device Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map(d => (
            <DeviceCard
              key={d.id}
              device={d}
              disabled={!overrideMode}
              onToggle={toggleDeviceLocal}
            // No delete/edit props = read-only mode
            />
          ))}
          {devices.length === 0 && (
            <p className="text-slate-500 italic col-span-full">
              No devices connected.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
