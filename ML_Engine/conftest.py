import os
import sys

# Ensure the ML_Engine directory is in the python path
# This allows imports like 'from src...' to work when running pytest from this directory
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
