// backend/seed.js
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "app.db");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  updated_at TEXT NOT NULL,
  image_url TEXT
);
`);

const now = new Date().toISOString();
const products = [
    {
        id: 1,
        name: 'Polo Oversize Blanco',
        price: 59.90,
        stock: 120,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5480332%2FPolo-Oversized-Fit---Blanco---H-M-PE.jpg%3Fv%3D638846392878400000'
    },
    {
        id: 2,
        name: 'Casaca Denim Unisex',
        price: 199.00,
        stock: 35,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5718875%2FCasaca-denim---Azul-denim-claro---H-M-PE.jpg%3Fv%3D638857880500530000'
    },
    {
        id: 3,
        name: 'Jogger Negro',
        price: 89.90,
        stock: 70,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5471031%2FPantalon-de-buzo-Regular-Fit---Negro---H-M-PE.jpg%3Fv%3D638846317327130000'
    },
    {
        id: 4,
        name: 'Zapatillas Urban',
        price: 249.00,
        stock: 22,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5914110%2FZapatillas---Blanco---H-M-PE.jpg%3Fv%3D638875192327200000'
    },
    {
        id: 5,
        name: 'Jean Azul Hombre',
        price: 159.00,
        stock: 15,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5415490%2FLoose-Jeans---Azul-denim---H-M-PE.jpg%3Fv%3D638845535918400000'
    },
    {
        id: 6,
        name: 'Top Negro',
        price: 39.00,
        stock: 25,
        updated_at: now,
        image_url: 'https://hmperu.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5547213%2FPolo-crop-sin-mangas---Negro---H-M-PE.jpg%3Fv%3D638847154348970000'
    }
];

const insert = db.prepare(`
  INSERT INTO products (name, price, stock, updated_at, image_url)
  VALUES (@name, @price, @stock, @updated_at, @image_url)
`);

db.transaction(() => {
    db.exec("DELETE FROM products");
    products.forEach((p) => insert.run(p));
})();

console.log(`✅ ${products.length} productos insertados correctamente.`);
db.close();
