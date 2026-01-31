import { useEffect, useState } from "react";

import BatteryBar from "../components/BatteryBar";
import ForecastCard from "../components/ForecastCard";
import OverrideToggle from "../components/OverrideToggle";
import DeviceCard from "../components/DeviceCard";
import SolarChart from "../components/SolarChart";
import ScheduleTimeline from "../components/ScheduleTimeline";
import AddDeviceForm from "../components/AddDeviceForm";

import {
  getState,
  toggleDevice,
  addDevice,
  deleteDevice,
  updateDevice
} from "../services/mockApi";


export default function Dashboard() {

  /* ===============================
     STATES
  =============================== */

  const [battery, setBattery] = useState(0);
  const [forecast, setForecast] = useState(0);
  const [override, setOverride] = useState(false);
  const [devices, setDevices] = useState([]);


  /* ===============================
     CHART DATA
  =============================== */

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    value: 120 + Math.floor(Math.random() * 150),
  }));


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
      setOverride(data.overrideMode ?? false);

    } catch {
      console.log("mock fallback");
    }
  };


  /* ===============================
     POLLING
  =============================== */

  useEffect(() => {
    fetchState();
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
     DELETE
  =============================== */

  const handleDeleteDevice = async (id) => {
    await deleteDevice(id);
    setDevices(prev => prev.filter(d => d.id !== id));
  };


  /* ===============================
     EDIT
  =============================== */

  const handleEditDevice = async (device) => {
    const name = prompt("Device name:", device.name);
    const power = prompt("Power (W):", device.powerW);
    const type = prompt("Type (CRITICAL/FLEXIBLE/OPTIONAL):", device.type);

    if (!name || !power || !type) return;

    const updated = {
      ...device,
      name,
      powerW: Number(power),
      type
    };

    await updateDevice(updated);

    setDevices(prev =>
      prev.map(d => (d.id === device.id ? updated : d))
    );
  };


  /* ===============================
     ADD
  =============================== */

  const handleAddDevice = async (device) => {
    await addDevice(device);
    setDevices(prev => [...prev, device]);
  };


  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-8 space-y-6">

      {/* TOP */}
      <div className="grid grid-cols-2 gap-6">
        <BatteryBar percent={battery} />
        <ForecastCard value={forecast} />
      </div>


      {/* CHART */}
      <SolarChart data={chartData} />


      {/* MODE TOGGLE */}
      <OverrideToggle
        override={override}
        setOverride={setOverride}
      />


      {/* ADD DEVICE FORM */}
      <AddDeviceForm onAdd={handleAddDevice} />


      {/* DEVICE LIST */}
      <div className="grid grid-cols-2 gap-4">
        {devices.map(d => (
          <DeviceCard
            key={d.id}
            device={d}
            disabled={!override}
            onToggle={toggleDeviceLocal}
            onDelete={handleDeleteDevice}   // ✅ added
            onEdit={handleEditDevice}       // ✅ added
          />
        ))}
      </div>


      {/* TIMELINE */}
      <ScheduleTimeline devices={devices} />

    </div>
  );
}
