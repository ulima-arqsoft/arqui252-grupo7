// backend/db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'app.db');
const db = new Database(dbPath);

// Crear tabla si no existe
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);
`);

function getProductById(id) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function updateProduct(id, fields) {
  const product = getProductById(id);
  if (!product) return false;

  const name = fields.name ?? product.name;
  const price = fields.price ?? product.price;
  const stock = fields.stock ?? product.stock;
  const updated_at = new Date().toISOString();

  db.prepare(`
    UPDATE products SET name = ?, price = ?, stock = ?, updated_at = ? WHERE id = ?
  `).run(name, price, stock, updated_at, id);

  return true;
}

module.exports = { getProductById, updateProduct, db };
