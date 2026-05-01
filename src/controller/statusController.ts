import type { Request, Response } from 'express';
import { 
    getAllStatusConfigs,
    createStatusConfig,
    updateStatusConfig,
    deleteStatusConfig,
    getAllActionConfigs,
    createActionConfig,
    updateActionConfig,
    deleteActionConfig
} from '../models/statusModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Status Configuration Controllers
export const getStatusConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await getAllStatusConfigs();
        res.json({
            success: true,
            data: configs,
            message: 'Status configurations retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching status configurations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch status configurations',
            error: 'Internal server error'
        });
    }
};

export const createStatusConfigHandler = async (req: Request, res: Response) => {
    try {
        const { name, category, color, is_default, final_stage, is_active } = req.body;
        
        // Validate required fields
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, category'
            });
        }

        const config = await createStatusConfig({
            name,
            category,
            color: color || '#1890ff',
            is_default: is_default || false,
            final_stage: final_stage || false,
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json({
            success: true,
            data: config,
            message: 'Status configuration created successfully'
        });
    } catch (error: any) {
        console.error('Error creating status configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create status configuration',
            error: 'Internal server error'
        });
    }
};

export const updateStatusConfigHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const configId = parseInt(idString || '0');
        
        if (isNaN(configId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status configuration ID'
            });
        }

        const updateData = req.body;
        const config = await updateStatusConfig(configId, updateData);
        
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Status configuration not found'
            });
        }

        res.json({
            success: true,
            data: config,
            message: 'Status configuration updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating status configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status configuration',
            error: 'Internal server error'
        });
    }
};

export const deleteStatusConfigHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const configId = parseInt(idString || '0');
        
        if (isNaN(configId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status configuration ID'
            });
        }

        const config = await deleteStatusConfig(configId);
        
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Status configuration not found'
            });
        }

        res.json({
            success: true,
            data: config,
            message: 'Status configuration deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting status configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete status configuration',
            error: 'Internal server error'
        });
    }
};

// Action Configuration Controllers
export const getActionConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await getAllActionConfigs();
        res.json({
            success: true,
            data: configs,
            message: 'Action configurations retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching action configurations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch action configurations',
            error: 'Internal server error'
        });
    }
};

export const createActionConfigHandler = async (req: Request, res: Response) => {
    try {
        const { name, type, icon, color, is_active } = req.body;
        
        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, type'
            });
        }

        const config = await createActionConfig({
            name,
            type,
            icon,
            color: color || '#1890ff',
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json({
            success: true,
            data: config,
            message: 'Action configuration created successfully'
        });
    } catch (error: any) {
        console.error('Error creating action configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create action configuration',
            error: 'Internal server error'
        });
    }
};

export const updateActionConfigHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const configId = parseInt(idString || '0');
        
        if (isNaN(configId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action configuration ID'
            });
        }

        const updateData = req.body;
        const config = await updateActionConfig(configId, updateData);
        
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Action configuration not found'
            });
        }

        res.json({
            success: true,
            data: config,
            message: 'Action configuration updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating action configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update action configuration',
            error: 'Internal server error'
        });
    }
};

export const deleteActionConfigHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const configId = parseInt(idString || '0');
        
        if (isNaN(configId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action configuration ID'
            });
        }

        const config = await deleteActionConfig(configId);
        
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Action configuration not found'
            });
        }

        res.json({
            success: true,
            data: config,
            message: 'Action configuration deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting action configuration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete action configuration',
            error: 'Internal server error'
        });
    }
};
