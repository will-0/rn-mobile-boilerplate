import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
from pydantic import BaseModel
import debugpy

from .database.mongo import fruits_collection
from .auth import auth_user

# Enable debugpy listener
if os.getenv("DEBUGPY_ENABLED", "true").lower() == "true":
    print("Starting Debugpy...")
    debugpy.listen(("0.0.0.0", 5678))

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Fruit(BaseModel):
    name: str
    color: str

@app.get("/")
def read_root():
    return "ping"

@app.get("/fruits")
async def read_fruits(current_user: str = Depends(auth_user)):
    fruits = await fruits_collection.find({}).to_list()
    parsed_fruits = [Fruit(**fruit) for fruit in fruits]
    return parsed_fruits
 
@app.get("/fruits/{fruit_id}")
def read_fruit(fruit_id: str, current_user: str = Depends(auth_user)):
    return Fruit(name="apple", color="red") 

@app.post("/fruits", status_code=status.HTTP_201_CREATED)
async def create_fruit(fruit: Fruit, current_user: str = Depends(auth_user)):
    await fruits_collection.insert_one(dict(fruit))
    return fruit

@app.delete("/fruits/{fruit_id}")
async def delete_fruit(fruit_id: str, current_user: str = Depends(auth_user)):
    await fruits_collection.delete_many({})
    return {"message": "All fruits deleted"}