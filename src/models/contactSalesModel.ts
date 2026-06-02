import { query } from '../config/db.js';

export interface ContactSalesSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  size: string;
  use_case?: string;
  description?: string;
  phone_number?: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  action_made?: string;
  created_at?: string;
  updated_at?: string;
}

export const initContactSalesTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contact_sales (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            size VARCHAR(50) NOT NULL,
            use_case VARCHAR(255),
            description TEXT,
            phone_number VARCHAR(50),
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
            action_made VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const addColumnsQuery = `
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_sales' AND column_name='status') THEN
                ALTER TABLE contact_sales ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled'));
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_sales' AND column_name='action_made') THEN
                ALTER TABLE contact_sales ADD COLUMN action_made VARCHAR(255);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_sales' AND column_name='updated_at') THEN
                ALTER TABLE contact_sales ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_sales' AND column_name='description') THEN
                ALTER TABLE contact_sales ADD COLUMN description TEXT;
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_sales' AND column_name='phone_number') THEN
                ALTER TABLE contact_sales ADD COLUMN phone_number VARCHAR(50);
            END IF;
        END $$;
    `;

    try {
        await query(createTableQuery);
        await query(addColumnsQuery);
        console.log('Contact sales table and columns verified/updated successfully.');
    } catch (err: any) {
        console.error('Error initializing contact sales table:', err.message);
        console.error(err.stack);
    }
};

export const getAllContactSales = async (): Promise<ContactSalesSubmission[]> => {
    const text = `
        SELECT * FROM contact_sales 
        ORDER BY created_at DESC
    `;
    const res = await query(text);
    return res.rows;
};

export const updateContactSalesStatus = async (id: number, status: { status: string }): Promise<ContactSalesSubmission> => {
    const text = `
        UPDATE contact_sales 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;
    const params = [status.status, id];
    const res = await query(text, params);
    return res.rows[0];
};

export const updateContactSalesAction = async (id: number, data: { action_made: string }): Promise<ContactSalesSubmission> => {
    const text = `
        UPDATE contact_sales 
        SET action_made = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;
    const params = [data.action_made, id];
    const res = await query(text, params);
    return res.rows[0];
};

export const deleteContactSales = async (id: number): Promise<ContactSalesSubmission> => {
    const text = `
        DELETE FROM contact_sales 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};

export const createSubmission = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    size: string;
    useCase?: string | null;
    phoneNumber?: string | null;
    description?: string | null;
}): Promise<ContactSalesSubmission> => {
    const text = `
        INSERT INTO contact_sales (first_name, last_name, email, company, size, use_case, phone_number, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const params = [
        data.firstName,
        data.lastName,
        data.email,
        data.company,
        data.size,
        data.useCase || null,
        data.phoneNumber || null,
        data.description || null
    ];
    const res = await query(text, params);
    return res.rows[0];
};

