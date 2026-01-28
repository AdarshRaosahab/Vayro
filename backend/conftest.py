import sys
from unittest.mock import MagicMock

# Mock asyncpg before it is imported by main.py
sys.modules["asyncpg"] = MagicMock()
