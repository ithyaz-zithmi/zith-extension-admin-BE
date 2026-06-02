import { query } from '../config/db.js';

export interface ContactSubmission {
  id: number;
  company_name: string;
  phone_number: string;
  company_email: string;
  industry: string;
  subject: string;
  is_partial: boolean;
  session_id: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  action_made?: string;
  created_at?: string;
  is_read?: boolean;
}

export const initContactTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(255),
            phone_number VARCHAR(50),
            company_email VARCHAR(255),
            industry VARCHAR(255),
            subject TEXT,
            is_partial BOOLEAN DEFAULT FALSE,
            session_id VARCHAR(255),
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
            action_made VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE
        );
    `;

    const addColumnsQuery = `
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_submissions' AND column_name='status') THEN
                ALTER TABLE contact_submissions ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled'));
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_schema = current_schema() AND table_name='contact_submissions' AND column_name='action_made') THEN
                ALTER TABLE contact_submissions ADD COLUMN action_made VARCHAR(255);
            END IF;
        END $$;
    `;

    try {
        await query(createTableQuery);
        await query(addColumnsQuery);
        console.log('Contact submissions table and columns ready');
    } catch (err: any) {
        console.error('Error initializing contact submissions table:', err.message);
        console.error(err.stack);
    }
};

export const getAllContactSubmissions = async (): Promise<ContactSubmission[]> => {
    const text = `
        SELECT * FROM contact_submissions 
        ORDER BY created_at DESC
    `;
    const res = await query(text);
    return res.rows;
};

export const markMessageAsRead = async (id: number): Promise<ContactSubmission> => {
    const text = `
        UPDATE contact_submissions 
        SET is_read = TRUE 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};

export const updateContactStatus = async (id: number, status: string): Promise<ContactSubmission> => {
    const text = `
        UPDATE contact_submissions 
        SET status = $1 
        WHERE id = $2
        RETURNING *
    `;
    const res = await query(text, [status, id]);
    return res.rows[0];
};

export const updateContactAction = async (id: number, action: string): Promise<ContactSubmission> => {
    const text = `
        UPDATE contact_submissions 
        SET action_made = $1 
        WHERE id = $2
        RETURNING *
    `;
    const res = await query(text, [action, id]);
    return res.rows[0];
};

export const deleteContactSubmission = async (id: number): Promise<ContactSubmission> => {
    const text = `
        DELETE FROM contact_submissions 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};

export const createContactSubmission = async (submission: Omit<ContactSubmission, 'id' | 'created_at' | 'is_read' | 'status' | 'action_made'>): Promise<ContactSubmission> => {
    const text = `
        INSERT INTO contact_submissions (company_name, phone_number, company_email, industry, subject, is_partial, session_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const params = [
        submission.company_name,
        submission.phone_number,
        submission.company_email,
        submission.industry,
        submission.subject,
        submission.is_partial,
        submission.session_id
    ];
    const res = await query(text, params);
    return res.rows[0];
};
