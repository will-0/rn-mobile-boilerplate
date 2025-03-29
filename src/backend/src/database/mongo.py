from motor.motor_asyncio import AsyncIOMotorClient
import os

# SETUP
_client = AsyncIOMotorClient(os.environ["MONGO_CONNECTION_STRING"])  # Connection URI
_db = _client["main"]  # Database name

# COLLECTIONS
fruits_collection = _db.get_collection("fruits")