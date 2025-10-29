import Redis from "ioredis";

const redis = new Redis({ host: "redis", port: 6379 });

async function processOrders() {
  console.log("[Worker] Esperando mensajes...");

  while (true) {
    const res = await redis.blpop("orders_queue", 0);

    if (!res) {
      continue; // seguridad por si redis devolviera null
    }

    const msg = JSON.parse(res[1]);
    console.log(`[Worker] 📨 Recibido pedido de cliente ${msg.customer_id}`);
    console.log("[Worker] Procesando...");

    await new Promise((resolve) => setTimeout(resolve, 2000)); // simula trabajo pesado

    console.log(`[Worker] ✅ Pedido procesado (total: ${msg.total})`);
  }
}

processOrders().catch(console.error);