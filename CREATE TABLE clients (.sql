CREATE TABLE clients (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	created_at TEXT,
	updated_at TEXT
);
CREATE TABLE products (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	created_at TEXT,
	updated_at TEXT
);
CREATE TABLE parts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	pn TEXT NOT NULL,
	description TEXT NOT NULL,
	quantity TEXT NOT NULL,
	stock TEXT NOT NULL,
	created_at TEXT,
	updated_at TEXT
);
CREATE TABLE parts_products (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	part_id INTEGER,
	product_id INTEGER
);
