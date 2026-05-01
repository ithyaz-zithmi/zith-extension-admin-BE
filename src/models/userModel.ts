import { query } from '../config/db.js';

export const initDb = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            reset_token VARCHAR(255),
            reset_token_expiry BIGINT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createTableQuery);
        console.log('Users table ready 📊');
    } catch (err: any) {
        console.error('Error initializing database:', err.message);
        console.error(err.stack);
    }
};

export const createUser = async (name: string, email: string, passwordHash: string) => {
    const text = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email;
    `;
    const params = [name, email, passwordHash];
    const res = await query(text, params);
    return res.rows[0];
};

export const findUserByEmail = async (email: string) => {
    const text = 'SELECT * FROM users WHERE email = $1';
    const res = await query(text, [email]);
    return res.rows[0];
};

export const updateUserResetToken = async (email: string, token: string, expiry: number) => {
    const text = `
        UPDATE users 
        SET reset_token = $1, reset_token_expiry = $2 
        WHERE email = $3
        RETURNING id;
    `;
    const res = await query(text, [token, expiry, email]);
    return res.rows[0];
};
