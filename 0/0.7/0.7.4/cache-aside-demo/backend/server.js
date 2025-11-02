// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { getProductById, updateProduct } = require('./db');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || '1800', 10);

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
});

// Helper métricas simples
async function incr(key) { try { await redis.incr(key); } catch { } }
async function getInt(key) {
    try { return parseInt(await redis.get(key) || '0', 10); } catch { return 0; }
}

// Health
app.get('/api/health', async (_req, res) => {
    try {
        const t0 = Date.now();
        await redis.ping();
        const redisLatency = Date.now() - t0;
        res.json({ ok: true, redisLatencyMs: redisLatency, ts: new Date().toISOString() });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// GET producto con Cache-Aside
app.get('/api/products/:id', async (req, res) => {
    const id = req.params.id;
    const key = `product:${id}`;
    try {
        const cached = await redis.get(key);
        if (cached) {
            await incr('cache:hit');
            const ttl = await redis.ttl(key);
            return res.json({
                source: 'cache',
                ttlSeconds: ttl,
                data: JSON.parse(cached)
            });
        }

        await incr('cache:miss');
        const prod = getProductById(id);
        if (!prod) return res.status(404).json({ error: 'Not found' });

        await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(prod));
        const ttl = await redis.ttl(key);
        res.json({ source: 'db', ttlSeconds: ttl, data: prod });
    } catch (e) {
        console.error('GET /api/products error', e);
        res.status(500).json({ error: 'internal' });
    }
});

// PUT producto -> actualiza DB + invalidación de caché
app.put('/api/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const ok = updateProduct(id, req.body || {});
        if (!ok) return res.status(404).json({ error: 'Not found' });

        await redis.del(`product:${id}`); // invalidación
        res.json({ updated: true });
    } catch (e) {
        console.error('PUT /api/products error', e);
        res.status(500).json({ error: 'internal' });
    }
});

// === Métricas de rendimiento extendidas ===
app.get("/api/performance", async (req, res) => {
    const startRedis = performance.now();
    try {
        // Medir tiempo de respuesta de Redis (ping)
        await redis.ping();
    } catch (err) {
        console.error("Redis error:", err.message);
    }
    const redisResponseTimeMs = performance.now() - startRedis;

    // Medir tiempo de respuesta de DB
    const startDB = performance.now();
    try {
        // Ejecutamos una consulta pequeña en SQLite (producto por ID fijo)
        db.prepare("SELECT id FROM products WHERE id = 1").get();
    } catch (err) {
        console.error("DB error:", err.message);
    }
    const dbResponseTimeMs = performance.now() - startDB;

    // Recuperar contadores
    const [hit, miss] = await Promise.all([
        redis.get("cache:hit"),
        redis.get("cache:miss"),
    ]);

    const h = parseInt(hit || "0");
    const m = parseInt(miss || "0");
    const ratio = h + m > 0 ? h / (h + m) : 0;

    res.json({
        timestamp: new Date().toISOString(),
        redisResponseTimeMs: +redisResponseTimeMs.toFixed(2),
        dbResponseTimeMs: +dbResponseTimeMs.toFixed(2),
        cache: {
            hit: h,
            miss: m,
            hitRatio: +ratio.toFixed(3),
        },
    });
});

// Start
app.listen(PORT, () => {
    console.log(`🚀 API escuchando en ${BASE_URL}`);
});
