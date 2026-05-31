import { query } from '../config/db.js';

export interface ProductPage {
  id: number;
  product_id: number;
  product_name?: string | undefined;
  name: string;
  code: string;
  description?: string | undefined;
  url?: string | undefined;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const initPageTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS product_pages (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name VARCHAR(150) NOT NULL,
      code VARCHAR(60) NOT NULL,
      description TEXT,
      url VARCHAR(500),
      status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (product_id, code)
    );
  `;
  try {
    await query(sql);
    console.log('Product pages table ready');
  } catch (err: any) {
    console.error('Error initializing product pages table:', err.message);
  }
};

export const getAllPages = async (): Promise<ProductPage[]> => {
  const res = await query(`
    SELECT p.*, pr.name AS product_name
    FROM product_pages p
    JOIN products pr ON pr.id = p.product_id
    ORDER BY pr.name, p.name
  `);
  return res.rows;
};

export const getPagesByProduct = async (productId: number): Promise<ProductPage[]> => {
  const res = await query(`
    SELECT p.*, pr.name AS product_name
    FROM product_pages p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.product_id = $1
    ORDER BY p.name
  `, [productId]);
  return res.rows;
};

export const createPage = async (data: Omit<ProductPage, 'id' | 'product_name' | 'created_at' | 'updated_at'>): Promise<ProductPage> => {
  const res = await query(
    `INSERT INTO product_pages (product_id, name, code, description, url, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.product_id, data.name, data.code, data.description || null, data.url || null, data.status || 'active']
  );
  return res.rows[0];
};

export const updatePage = async (id: number, data: Partial<Omit<ProductPage, 'id' | 'product_name' | 'created_at' | 'updated_at'>>): Promise<ProductPage | null> => {
  const res = await query(
    `UPDATE product_pages SET
        product_id = COALESCE($1, product_id),
        name = COALESCE($2, name),
        code = COALESCE($3, code),
        description = COALESCE($4, description),
        url = COALESCE($5, url),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
     WHERE id = $7 RETURNING *`,
    [data.product_id ?? null, data.name ?? null, data.code ?? null, data.description ?? null, data.url ?? null, data.status ?? null, id]
  );
  return res.rows[0] || null;
};

export const deletePage = async (id: number): Promise<ProductPage | null> => {
  const res = await query('DELETE FROM product_pages WHERE id = $1 RETURNING *', [id]);
  return res.rows[0] || null;
};
