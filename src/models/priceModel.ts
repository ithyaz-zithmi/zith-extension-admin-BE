import { query } from '../config/db.js';

export interface PriceSetting {
  id: number;
  type: 'Freelance' | 'Starter' | 'Business' | 'Enterprise';
  title: string;
  subtitle: string;
  amount_type: 'monthly' | 'yearly';
  monthly_amount: number;
  yearly_amount: number;
  points: string[];
  button_text: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const initPriceTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS price_settings (
            id SERIAL PRIMARY KEY,
            type VARCHAR(20) NOT NULL CHECK (type IN ('Freelance', 'Starter', 'Business', 'Enterprise')),
            title VARCHAR(255) NOT NULL,
            subtitle TEXT NOT NULL,
            amount_type VARCHAR(10) NOT NULL CHECK (amount_type IN ('monthly', 'yearly')),
            monthly_amount DECIMAL(10,2) NOT NULL CHECK (monthly_amount >= 0),
            yearly_amount DECIMAL(10,2) NOT NULL CHECK (yearly_amount >= 0),
            points TEXT[] NOT NULL,
            button_text VARCHAR(255) NOT NULL DEFAULT 'Get Started',
            status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createTableQuery);
        console.log('Price settings table ready');
    } catch (err: any) {
        console.error('Error initializing price settings table:', err.message);
        console.error(err.stack);
    }
};

export const getAllPriceSettings = async (): Promise<PriceSetting[]> => {
    const text = `
        SELECT * FROM price_settings 
        ORDER BY monthly_amount ASC, created_at ASC
    `;
    const res = await query(text);
    return res.rows;
};

export const createPriceSetting = async (setting: Omit<PriceSetting, 'id' | 'created_at' | 'updated_at'> & { amount: number }): Promise<PriceSetting> => {
    // Calculate both amounts based on amount_type
    let monthly_amount: number;
    let yearly_amount: number;
    
    if (setting.amount_type === 'monthly') {
        monthly_amount = setting.amount;
        yearly_amount = setting.amount * 12; // Yearly = monthly * 12
    } else {
        yearly_amount = setting.amount;
        monthly_amount = setting.amount / 12; // Monthly = yearly / 12
    }
    
    const text = `
        INSERT INTO price_settings (type, title, subtitle, amount_type, monthly_amount, yearly_amount, points, button_text, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const params = [
        setting.type,
        setting.title,
        setting.subtitle,
        setting.amount_type,
        monthly_amount,
        yearly_amount,
        setting.points,
        setting.button_text || 'Get Started',
        setting.status || 'active'
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const updatePriceSetting = async (id: number, setting: Partial<Omit<PriceSetting, 'id' | 'created_at' | 'updated_at'>> & { amount?: number }): Promise<PriceSetting> => {
    // Calculate both amounts if amount is provided
    let monthly_amount = setting.monthly_amount;
    let yearly_amount = setting.yearly_amount;
    
    if (setting.amount !== undefined) {
        if (setting.amount_type === 'monthly') {
            monthly_amount = setting.amount;
            yearly_amount = setting.amount * 12; // Yearly = monthly * 12
        } else {
            yearly_amount = setting.amount;
            monthly_amount = setting.amount / 12; // Monthly = yearly / 12
        }
    }
    
    const text = `
        UPDATE price_settings 
        SET type = COALESCE($1, type),
            title = COALESCE($2, title),
            subtitle = COALESCE($3, subtitle),
            amount_type = COALESCE($4, amount_type),
            monthly_amount = COALESCE($5, monthly_amount),
            yearly_amount = COALESCE($6, yearly_amount),
            points = COALESCE($7, points),
            button_text = COALESCE($8, button_text),
            status = COALESCE($9, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
    `;
    const params = [
        setting.type ?? null,
        setting.title ?? null,
        setting.subtitle ?? null,
        setting.amount_type ?? null,
        monthly_amount ?? null,
        yearly_amount ?? null,
        setting.points ?? null,
        setting.button_text ?? null,
        setting.status ?? null,
        id
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const deletePriceSetting = async (id: number): Promise<PriceSetting> => {
    const text = `
        DELETE FROM price_settings 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};
