from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://db:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client["fruits_db"]  # Database name

# Collections for payslips and contracts
fruits_collection = db.get_collection("fruits")