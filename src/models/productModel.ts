import { query } from '../config/db.js';

export interface Product {
  id: number;
  name: string;
  code: string;
  description?: string | undefined;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const initProductTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      code VARCHAR(60) NOT NULL UNIQUE,
      description TEXT,
      status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await query(sql);
    console.log('Products table ready');
  } catch (err: any) {
    console.error('Error initializing products table:', err.message);
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await query('SELECT * FROM products ORDER BY name ASC');
  return res.rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const res = await query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0] || null;
};

export const createProduct = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const res = await query(
    `INSERT INTO products (name, code, description, status)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.name, data.code, data.description || null, data.status || 'active']
  );
  return res.rows[0];
};

export const updateProduct = async (id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> => {
  const res = await query(
    `UPDATE products SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 RETURNING *`,
    [data.name ?? null, data.code ?? null, data.description ?? null, data.status ?? null, id]
  );
  return res.rows[0] || null;
};

export const deleteProduct = async (id: number): Promise<Product | null> => {
  const res = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return res.rows[0] || null;
};
