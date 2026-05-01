import type { Request, Response } from 'express';
import { z } from 'zod';
import {
    getAllContactSubmissions,
    markMessageAsRead,
    deleteContactSubmission,
    createContactSubmission,
    updateContactStatus,
    updateContactAction
} from '../models/contactModel.js';
import type { ContactSubmission } from '../models/contactModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const contactSubmissionSchema = z.object({
    company_name: z.string().min(1).max(255),
    company_email: z.string().email("Invalid email address").max(255),
    subject: z.string().min(1).max(500),
    phone_number: z.string().max(50).optional().default(''),
    industry: z.string().max(255).optional().default(''),
    is_partial: z.boolean().optional().default(false),
    session_id: z.string().max(255).optional().default(''),
});

// Get all contact submissions
export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await getAllContactSubmissions();
        res.json({
            success: true,
            data: messages,
            message: 'Contact messages retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact messages',
            error: 'Internal server error'
        });
    }
};

// Mark message as read
export const markMessageAsReadHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const messageId = parseInt(idString || '0');
        
        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID'
            });
        }

        const message = await markMessageAsRead(messageId);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: message,
            message: 'Message marked as read successfully'
        });
    } catch (error: any) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read',
            error: 'Internal server error'
        });
    }
};

// Delete contact submission
export const deleteContactMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const messageId = parseInt(idString || '0');
        
        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID'
            });
        }

        const message = await deleteContactSubmission(messageId);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: message,
            message: 'Message deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: 'Internal server error'
        });
    }
};

// Update contact status
export const updateContactStatusHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const { status } = req.body;
        const messageId = parseInt(idString || '0');

        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID'
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const message = await updateContactStatus(messageId, status);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: message,
            message: 'Message status updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating message status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message status',
            error: 'Internal server error'
        });
    }
};

// Update contact action
export const updateContactActionHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const { action_made } = req.body;
        const messageId = parseInt(idString || '0');

        if (isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID'
            });
        }

        const message = await updateContactAction(messageId, action_made);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            data: message,
            message: 'Message action updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating message action:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message action',
            error: 'Internal server error'
        });
    }
};

// Create new contact submission (for your website contact form)
export const createContactMessage = async (req: Request, res: Response) => {
    try {
        const parseResult = contactSubmissionSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: parseResult.error.issues,
            });
        }

        const submission = await createContactSubmission(parseResult.data);

        res.status(201).json({
            success: true,
            data: submission,
            message: 'Contact submission created successfully'
        });
    } catch (error: any) {
        console.error('Error creating contact submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create contact submission',
            error: 'Internal server error'
        });
    }
};
