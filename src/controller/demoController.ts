import type { Request, Response } from 'express';
import { 
    getAllDemoRequests, 
    updateDemoRequestStatus, 
    updateDemoRequestAction,
    deleteDemoRequest
} from '../models/demoModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Get all demo requests
export const getDemoRequests = async (req: Request, res: Response) => {
    try {
        const requests = await getAllDemoRequests();
        res.json({
            success: true,
            data: requests,
            message: 'Demo requests retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching demo requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch demo requests',
            error: 'Internal server error'
        });
    }
};

// Update demo request status
export const updateDemoRequestStatusHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const requestId = parseInt(idString || '0');
        
        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid demo request ID'
            });
        }

        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        // Validate status
        const validStatuses = ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const request = await updateDemoRequestStatus(requestId, { status });
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Demo request not found'
            });
        }

        res.json({
            success: true,
            data: request,
            message: 'Demo request status updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating demo request status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update demo request status',
            error: 'Internal server error'
        });
    }
};

// Update demo request action
export const updateDemoRequestActionHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const requestId = parseInt(idString || '0');
        
        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid demo request ID'
            });
        }

        const { action_made } = req.body;
        
        if (!action_made) {
            return res.status(400).json({
                success: false,
                message: 'Action is required'
            });
        }

        const request = await updateDemoRequestAction(requestId, { action_made });
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Demo request not found'
            });
        }

        res.json({
            success: true,
            data: request,
            message: 'Demo request action updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating demo request action:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update demo request action',
            error: 'Internal server error'
        });
    }
};

// Delete demo request
export const deleteDemoRequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const requestId = parseInt(idString || '0');
        
        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid demo request ID'
            });
        }

        const request = await deleteDemoRequest(requestId);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Demo request not found'
            });
        }

        res.json({
            success: true,
            data: request,
            message: 'Demo request deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting demo request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete demo request',
            error: 'Internal server error'
        });
    }
};
