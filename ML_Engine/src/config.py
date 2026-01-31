
CONFIG = {
    "forecast_method": "arima",       # persistence, arima
    "horizon_hours": 24,
    "train_days": 7,
    "arima_order": (2, 1, 2),
    "arima_seasonal": (1, 1, 1, 24),
    "blend_ratio": 0.7,              # 70% ARIMA + 30% persistence
}
