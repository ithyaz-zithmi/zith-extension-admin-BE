import type { Request, Response } from 'express';
import { 
    getAllPriceSettings, 
    createPriceSetting, 
    updatePriceSetting, 
    deletePriceSetting
} from '../models/priceModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Get all price settings
export const getPriceSettings = async (req: Request, res: Response) => {
    try {
        const settings = await getAllPriceSettings();
        res.json({
            success: true,
            data: settings,
            message: 'Price settings retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching price settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch price settings',
            error: 'Internal server error'
        });
    }
};

// Create new price setting
export const createPriceSettingHandler = async (req: Request, res: Response) => {
    try {
        const { type, title, subtitle, amount_type, amount, points, button_text, status } = req.body;
        
        // Validate required fields
        if (!type || !title || !subtitle || !amount_type || amount === undefined || !points || !button_text) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: type, title, subtitle, amount_type, amount, points, button_text'
            });
        }

        // Validate type
        if (!['Freelance', 'Starter', 'Business', 'Enterprise'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'type must be one of: Freelance, Starter, Business, Enterprise'
            });
        }

        // Validate status if provided
        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "active" or "inactive"'
            });
        }

        // Validate amount_type
        if (!['monthly', 'yearly'].includes(amount_type)) {
            return res.status(400).json({
                success: false,
                message: 'amount_type must be either "monthly" or "yearly"'
            });
        }

        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'amount must be a non-negative number'
            });
        }

        // Validate points array
        if (!Array.isArray(points) || points.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'points must be a non-empty array'
            });
        }

        // Validate button_text
        if (typeof button_text !== 'string' || button_text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'button_text must be a non-empty string'
            });
        }

        if (button_text.length > 255) {
            return res.status(400).json({
                success: false,
                message: 'button_text must be 255 characters or less'
            });
        }

        const setting = await createPriceSetting({
            type,
            title,
            subtitle,
            amount_type,
            monthly_amount: 0, // Will be calculated in the model function
            yearly_amount: 0,  // Will be calculated in the model function
            points,
            button_text: button_text.trim(),
            status: status || 'active',
            amount,
        });

        res.status(201).json({
            success: true,
            data: setting,
            message: 'Price setting created successfully'
        });
    } catch (error: any) {
        console.error('Error creating price setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create price setting',
            error: 'Internal server error'
        });
    }
};

// Update price setting
export const updatePriceSettingHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const settingId = parseInt(idString || '0');
        
        if (isNaN(settingId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price setting ID'
            });
        }

        const updateData = req.body;

        // Validate amount_type if provided
        if (updateData.amount_type && !['monthly', 'yearly'].includes(updateData.amount_type)) {
            return res.status(400).json({
                success: false,
                message: 'amount_type must be either "monthly" or "yearly"'
            });
        }

        // Validate amount if provided
        if (updateData.amount !== undefined) {
            const numericAmount = Number(updateData.amount);
            if (isNaN(numericAmount) || numericAmount < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'amount must be a non-negative number'
                });
            }
            updateData.amount = numericAmount; // Ensure it's passed as a number to the model
        }

        // Validate points if provided
        if (updateData.points && (!Array.isArray(updateData.points) || updateData.points.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'points must be a non-empty array'
            });
        }

        // Validate button_text if provided
        if (updateData.button_text !== undefined) {
            if (typeof updateData.button_text !== 'string' || updateData.button_text.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'button_text must be a non-empty string'
                });
            }

            if (updateData.button_text.length > 255) {
                return res.status(400).json({
                    success: false,
                    message: 'button_text must be 255 characters or less'
                });
            }

            updateData.button_text = updateData.button_text.trim();
        }

        const setting = await updatePriceSetting(settingId, updateData);
        
        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Price setting not found'
            });
        }

        res.json({
            success: true,
            data: setting,
            message: 'Price setting updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating price setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update price setting',
            error: 'Internal server error'
        });
    }
};

// Delete price setting
export const deletePriceSettingHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const settingId = parseInt(idString || '0');
        
        if (isNaN(settingId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price setting ID'
            });
        }

        const setting = await deletePriceSetting(settingId);
        
        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'Price setting not found'
            });
        }

        res.json({
            success: true,
            data: setting,
            message: 'Price setting deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting price setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete price setting',
            error: 'Internal server error'
        });
    }
};
