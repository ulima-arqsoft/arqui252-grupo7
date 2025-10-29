from fastapi import FastAPI
from pydantic import BaseModel
import redis
import json

app = FastAPI()

# Conexión a Redis (cola)
r = redis.Redis(host="redis", port=6379, db=0, decode_responses=True)

class Order(BaseModel):
    customer_id: int
    total: float

@app.post("/orders")
def create_order(order: Order):
    event = {"type": "OrderCreated", "customer_id": order.customer_id, "total": order.total}
    # Encolar en lista Redis (FIFO)
    r.rpush("orders_queue", json.dumps(event))
    queue_length = r.llen("orders_queue")
    return {"status": "accepted", "queued_length": queue_length}