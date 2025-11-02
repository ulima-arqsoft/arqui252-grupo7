// backend/seed.js
const { db } = require('./db');

const rows = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (rows.c === 0) {
    const stmt = db.prepare('INSERT INTO products (id,name,price,stock,updated_at) VALUES (?,?,?,?,?)');
    const now = new Date().toISOString();
    const products = [
        [1, 'Polera Classic', 79.9, 15, now],
        [2, 'Jeans Slim', 129.9, 40, now],
        [3, 'Zapatillas Urban', 199.0, 25, now],
        [4, 'Casaca Denim', 159.0, 10, now],
        [5, 'Gorro Beanie', 39.0, 80, now],
    ];
    const tx = db.transaction((items) => {
        for (const p of items) stmt.run(...p);
    });
    tx(products);
    console.log('Seed OK: productos insertados.');
} else {
    console.log('Seed omitido: ya existen productos.');
}
