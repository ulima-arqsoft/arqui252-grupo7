// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { customAlphabet } = require('nanoid');

const app = express();
app.use(cors({ origin: '*' })); // abierto para front separado (demo)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Config ---
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const URL_TTL_SECONDS = parseInt(process.env.URL_TTL_SECONDS || '604800', 10);

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 7);

// --- Helpers ---
function normalizeUrl(input) {
  try {
    const hasScheme = /^https?:\/\//i.test(input);
    const u = new URL(hasScheme ? input : `https://${input}`);
    return u.toString();
  } catch {
    return null;
  }
}

async function scanKeys(pattern = 'url:*', count = 200) {
  let cursor = '0';
  const all = [];
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    cursor = next;
    all.push(...keys);
  } while (cursor !== '0');
  return all;
}

// Middleware de medición de rendimiento
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    console.log(`[PERF] ${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)} ms`);
  });
  next();
});

// --- API: crear short URL ---
app.post('/api/shorten', async (req, res) => {
  try {
    const inputUrl = (req.body.url || '').trim();
    const normalized = normalizeUrl(inputUrl);
    if (!normalized) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    // Generar código (poca probabilidad de colisión; reintenta si existe)
    let code = nanoid(), tries = 0;
    while (tries < 3 && (await redis.exists(`url:${code}`)) === 1) {
      code = nanoid(); tries++;
    }

    // Guardar en Redis (KV + TTL) y contador
    const pipeline = redis.multi();
    pipeline.set(`url:${code}`, normalized, 'EX', URL_TTL_SECONDS);
    pipeline.setnx(`clicks:${code}`, 0);
    pipeline.hset(`meta:${code}`, {
      created_at: new Date().toISOString(),
      ttl_seconds: URL_TTL_SECONDS.toString(),
      base_url: BASE_URL,
    });
    await pipeline.exec();

    return res.json({ code, shortUrl: `${BASE_URL}/${code}`, ttlSeconds: URL_TTL_SECONDS });
  } catch (err) {
    console.error('shorten error', err);
    return res.status(500).json({ error: 'No se pudo acortar la URL' });
  }
});

// --- API: eliminar una URL corta en Redis ---
app.delete('/api/url/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const urlKey = `url:${code}`;
    const clicksKey = `clicks:${code}`;
    const metaKey = `meta:${code}`;

    // si no existe la clave principal, devolvemos 404
    const exists = await redis.exists(urlKey);
    if (!exists) return res.status(404).json({ error: 'No existe o ya expiró' });

    // eliminar en una sola pasada
    const results = await redis.del(urlKey, clicksKey, metaKey);

    // results = cantidad de claves eliminadas
    return res.json({ deleted: results > 0, code });
  } catch (err) {
    console.error('delete error', err);
    return res.status(500).json({ error: 'No se pudo eliminar la URL' });
  }
});

// --- API: stats de una URL ---
app.get('/api/stats/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [url, clicks, ttl, meta] = await Promise.all([
      redis.get(`url:${code}`),
      redis.get(`clicks:${code}`),
      redis.ttl(`url:${code}`),
      redis.hgetall(`meta:${code}`),
    ]);
    if (!url) return res.status(404).json({ error: 'No existe o expiró' });

    return res.json({
      code,
      originalUrl: url,
      clicks: parseInt(clicks || '0', 10),
      ttlSeconds: typeof ttl === 'number' ? ttl : parseInt(ttl || '0', 10),
      meta,
    });
  } catch (err) {
    console.error('stats error', err);
    return res.status(500).json({ error: 'No se pudo obtener estadísticas' });
  }
});

// --- API: listar URLs vigentes (no expiradas) ---
app.get('/api/list', async (_req, res) => {
  try {
    // 1) obtener todas las keys url:* (vigentes)
    const urlKeys = await scanKeys('url:*', 200);
    if (urlKeys.length === 0) {
      return res.json({ items: [] });
    }

    // 2) Derivar códigos
    const codes = urlKeys.map(k => k.slice('url:'.length));

    // 3) Pipeline para traer url, clicks, ttl, meta de todos
    const pipeline = redis.pipeline();
    codes.forEach(code => {
      pipeline.get(`url:${code}`);      // 0
      pipeline.get(`clicks:${code}`);   // 1
      pipeline.ttl(`url:${code}`);      // 2
      pipeline.hgetall(`meta:${code}`); // 3
    });
    const results = await pipeline.exec();

    // 4) Armar respuesta
    const items = [];
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      const base = i * 4;
      const url = results[base + 0][1];
      const clicks = results[base + 1][1];
      const ttl = results[base + 2][1];
      const meta = results[base + 3][1] || {};

      if (!url) continue; // si expiró entre el scan y ahora

      items.push({
        code,
        originalUrl: url,
        shortUrl: `${BASE_URL}/${code}`,
        clicks: parseInt(clicks || '0', 10),
        ttlSeconds: typeof ttl === 'number' ? ttl : parseInt(ttl || '0', 10),
        createdAt: meta.created_at || null,
      });
    }

    // 5) Ordenar por fecha de creación (desc), si no hay, por código
    items.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta || a.code.localeCompare(b.code);
    });

    return res.json({ items });
  } catch (err) {
    console.error('list error', err);
    return res.status(500).json({ error: 'No se pudo listar las URLs' });
  }
});

// --- Redirección + contador (INCR atómico) ---
app.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    if (code === 'api') return next(); // no chocar con /api/*
    const target = await redis.get(`url:${code}`);
    if (!target) return res.status(404).send('❌ Enlace no encontrado o expirado.');
    await redis.incr(`clicks:${code}`);
    return res.redirect(target);
  } catch (err) {
    console.error('redirect error', err);
    return res.status(500).send('Error interno');
  }
});

// --- API: métricas de rendimiento ---
app.get('/api/performance', async (_req, res) => {
  const startRedis = process.hrtime.bigint();
  await redis.ping();
  const endRedis = process.hrtime.bigint();
  const redisLatency = Number(endRedis - startRedis) / 1_000_000; // en ms

  return res.json({
    timestamp: new Date().toISOString(),
    backendResponseTime: Math.random() * 10 + 1, // simulación leve
    redisResponseTime: redisLatency.toFixed(2),
    status: 'ok',
  });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`🚀 API escuchando en ${BASE_URL}`);
});


