import pandas as pd
import os

def load_solar_csv(filename):
    """Load + clean historical solar CSV"""
    if not os.path.exists(filename):
        raise FileNotFoundError(f"{filename} not found")
    
    df = pd.read_csv(filename)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Last 7 days only
    df = df.tail(168).sort_values('timestamp').reset_index(drop=True)
    
    # Fill missing
    df['solar_power_kw'] = df['solar_power_kw'].ffill().fillna(0)
    df['load_total_kw'] = df['load_total_kw'].ffill().fillna(5)
    
    return df.set_index('timestamp')

def validate_data(df):
    """Basic data validation"""
    if len(df) < 24:
        raise ValueError("Need at least 1 day data")
    if df['solar_power_kw'].max() > 50:
        print("⚠️ High solar values detected")
    return True
