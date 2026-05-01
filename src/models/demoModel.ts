import { query } from '../config/db.js';

export interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  action_made?: string;
  created_at?: string;
  updated_at?: string;
}

export const initDemoTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS demo_requests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            company VARCHAR(255),
            phone VARCHAR(20),
            message TEXT,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
            action_made VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    const addActionColumnQuery = `
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='demo_requests' AND column_name='action_made') THEN
                ALTER TABLE demo_requests ADD COLUMN action_made VARCHAR(255);
            END IF;
        END $$;
    `;

    try {
        await query(createTableQuery);
        await query(addActionColumnQuery);
        console.log('Demo requests table and columns ready');
    } catch (err: any) {
        console.error('Error initializing demo requests table:', err.message);
        console.error(err.stack);
    }
};

export const getAllDemoRequests = async (): Promise<DemoRequest[]> => {
    const text = `
        SELECT * FROM demo_requests 
        ORDER BY created_at DESC
    `;
    const res = await query(text);
    return res.rows;
};

export const updateDemoRequestStatus = async (id: number, status: { status: string }): Promise<DemoRequest> => {
    const text = `
        UPDATE demo_requests 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;
    const params = [status.status, id];
    const res = await query(text, params);
    return res.rows[0];
};

export const updateDemoRequestAction = async (id: number, data: { action_made: string }): Promise<DemoRequest> => {
    const text = `
        UPDATE demo_requests 
        SET action_made = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;
    const params = [data.action_made, id];
    const res = await query(text, params);
    return res.rows[0];
};

export const deleteDemoRequest = async (id: number): Promise<DemoRequest> => {
    const text = `
        DELETE FROM demo_requests 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};
