from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/fruits/")
def read_fruits():
    fruit1 = {
        "id": 1,
        "name": "apple",
        "color": "red"
    }
    fruit2 = {
        "id": 2,
        "name": "banana",
        "color": "yellow"
    }
    fruit3 = {
        "id": 3,
        "name": "orange",
        "color": "orange"
    }
    return [fruit1, fruit2, fruit3]
 
@app.get("/fruits/{fruit_id}")
def read_fruit(fruit_id: int):
    return {
        "id": fruit_id,
        "name": "apple",
        "color": "red"
    } 