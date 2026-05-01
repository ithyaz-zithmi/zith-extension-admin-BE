import { query } from '../config/db.js';

export interface StatusConfig {
  id: number;
  name: string;
  category: string;
  color: string;
  is_default: boolean;
  final_stage: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ActionConfig {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const initStatusTables = async () => {
    const createStatusConfigTable = `
        CREATE TABLE IF NOT EXISTS status_configs (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            color VARCHAR(20) NOT NULL DEFAULT '#1890ff',
            is_default BOOLEAN NOT NULL DEFAULT false,
            final_stage BOOLEAN NOT NULL DEFAULT false,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createActionConfigTable = `
        CREATE TABLE IF NOT EXISTS action_configs (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(100) NOT NULL,
            icon VARCHAR(100) NOT NULL,
            color VARCHAR(20) NOT NULL DEFAULT '#1890ff',
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createStatusConfigTable);
        await query(createActionConfigTable);
        console.log('Status management tables ready');
    } catch (err: any) {
        console.error('Error initializing status management tables:', err.message);
        console.error(err.stack);
    }
};

// Status Configuration Functions
export const getAllStatusConfigs = async (): Promise<StatusConfig[]> => {
    const text = `
        SELECT * FROM status_configs 
        ORDER BY category ASC, name ASC
    `;
    const res = await query(text);
    return res.rows;
};

export const createStatusConfig = async (config: Omit<StatusConfig, 'id' | 'created_at' | 'updated_at'>): Promise<StatusConfig> => {
    const text = `
        INSERT INTO status_configs (name, category, color, is_default, final_stage, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const params = [
        config.name,
        config.category,
        config.color,
        config.is_default,
        config.final_stage,
        config.is_active
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const updateStatusConfig = async (id: number, config: Partial<Omit<StatusConfig, 'id' | 'created_at' | 'updated_at'>>): Promise<StatusConfig> => {
    const text = `
        UPDATE status_configs 
        SET name = COALESCE($1, name),
            category = COALESCE($2, category),
            color = COALESCE($3, color),
            is_default = COALESCE($4, is_default),
            final_stage = COALESCE($5, final_stage),
            is_active = COALESCE($6, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
    `;
    const params = [
        config.name ?? null,
        config.category ?? null,
        config.color ?? null,
        config.is_default ?? null,
        config.final_stage ?? null,
        config.is_active ?? null,
        id
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const deleteStatusConfig = async (id: number): Promise<StatusConfig> => {
    const text = `
        DELETE FROM status_configs 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};

// Action Configuration Functions
export const getAllActionConfigs = async (): Promise<ActionConfig[]> => {
    const text = `
        SELECT * FROM action_configs 
        ORDER BY type ASC, name ASC
    `;
    const res = await query(text);
    return res.rows;
};

export const createActionConfig = async (config: Omit<ActionConfig, 'id' | 'created_at' | 'updated_at'>): Promise<ActionConfig> => {
    const text = `
        INSERT INTO action_configs (name, type, icon, color, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const params = [
        config.name,
        config.type,
        config.icon,
        config.color,
        config.is_active
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const updateActionConfig = async (id: number, config: Partial<Omit<ActionConfig, 'id' | 'created_at' | 'updated_at'>>): Promise<ActionConfig> => {
    const text = `
        UPDATE action_configs 
        SET name = COALESCE($1, name),
            type = COALESCE($2, type),
            icon = COALESCE($3, icon),
            color = COALESCE($4, color),
            is_active = COALESCE($5, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
    `;
    const params = [
        config.name ?? null,
        config.type ?? null,
        config.icon ?? null,
        config.color ?? null,
        config.is_active ?? null,
        id
    ];
    const res = await query(text, params);
    return res.rows[0];
};

export const deleteActionConfig = async (id: number): Promise<ActionConfig> => {
    const text = `
        DELETE FROM action_configs 
        WHERE id = $1
        RETURNING *
    `;
    const res = await query(text, [id]);
    return res.rows[0];
};
