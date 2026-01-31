import pytest
import pandas as pd
from src.forecast_solar import forecast_solar
from src.data_utils import load_solar_csv

def test_forecast_shape():
    df = load_solar_csv("data/solar_data_sunny.csv")
    forecast = forecast_solar(df)
    assert len(forecast) == 24
    assert forecast.index.freq == 'H'

def test_no_negative_solar():
    df = load_solar_csv("data/solar_data_sunny.csv")
    forecast = forecast_solar(df)
    assert (forecast >= 0).all()

def test_persistence_pattern():
    df = load_solar_csv("data/solar_data_sunny.csv")
    persist = forecast_solar(df, method="persistence")
    arima = forecast_solar(df, method="arima")
    assert len(persist) == 24

# Run: pytest tests/test_forecast.py -v
