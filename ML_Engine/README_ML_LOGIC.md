# ML Engine - Solar Forecasting System

This module provides solar energy forecasting capabilities for the Solar-Scheduler backend. It uses historical solar data and weather patterns to predict energy generation (kW) for future dates and times.

## 🚀 Overview

The ML Engine is designed to be called by a **Node.js/Express backend** using standard CLI interfaces. It returns structured JSON data containing power forecasts, confidence levels, and trend analysis.

### Key Features
- **Weather-Aware**: Supports `sunny` and `cloudy` scenario-based modeling.
- **Flexible Targeting**: Specific time-of-day matching for any future date.
- **Standardized Units**: All outputs are in **kilowatts (kW)**.
- **Indian Date Format**: Supports `DD-MM-YYYY HH:MM` for ease of integration with local users.

---

## 🛠️ Setup & Installation

Ensure you have Python 3.8+ installed.

1. **Navigate to the ML_Engine directory**:
   ```bash
   cd ML_Engine
   ```

2. **Create a virtual environment (Recommended)**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🔌 Integration (Backend Calling ML)

The backend should call the ML engine via `cli.py`.

### Base Command Structure
```bash
python cli.py --target "DD-MM-YYYY HH:MM" --weather [sunny|cloudy] --format json
```

### Parameters
| Flag | Options | Description |
| :--- | :--- | :--- |
| `--target` | String | Target date/time (e.g., `"02-02-2026 14:00"`) |
| `--weather` | `sunny`, `cloudy` | Historical pattern to use (Default: `sunny`) |
| `--format` | `json`, `text` | Response format (Default: `json`) |
| `--horizon` | Integer | Hours to forecast ahead (Default: 48) |
| `--method` | `arima`, `persistence` | Forecasting model (Default: Ensemble Blend) |

### Example Node.js Execution
```javascript
const { spawn } = require('child_process');

const pythonProcess = spawn('python', [
  'cli.py', 
  '--target', '05-02-2026 14:30', 
  '--weather', 'sunny', 
  '--format', 'json'
]);

pythonProcess.stdout.on('data', (data) => {
  const result = JSON.parse(data.toString());
  console.log(`Predicted Power: ${result.target_forecast.predicted_kw} kW`);
});
```

---

## 📊 Data Specifications

### Input Date Formats
- `DD-MM-YYYY HH:MM` (Primary)
- `YYYY-MM-DD HH:MM` (ISO)

### Output JSON Structure
```json
{
  "status": "success",
  "timestamp": "31-01-2026 22:15:00",
  "weather": "sunny",
  "target_forecast": {
    "target_time": "02-02-2026 14:00",
    "predicted_kw": 8.45,
    "match_type": "pattern",
    "next_hours_kw": [
      {"hour": "15:00", "kw": 7.2},
      {"hour": "16:00", "kw": 5.1}
    ]
  },
  "forecast_kw": {
    "hour_1": 0.05,
    "hour_24_avg": 4.12
  }
}
```

---

## 🧪 Testing

You can test the engine manually using the provided test scripts:

- **CLI Test**: `python cli.py --target "01-02-2026 12:00"`
- **Automated Tests**: `pytest tests/`
- **Interactive System**: `python test_interactive.py`

---

## 📁 Directory Structure

- `/api`: Programmatic Python wrappers (`forecast_service.py`).
- `/data`: CSV files containing historical generation patterns.
- `/models`: Saved model weights and configurations.
- `/src`: Core forecasting logic and data utilities.
- `cli.py`: Main entry point for backend integration.
