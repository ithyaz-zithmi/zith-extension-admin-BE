import type { Request, Response } from 'express';
import { 
    getAllContactSales, 
    updateContactSalesStatus, 
    updateContactSalesAction,
    deleteContactSales,
    createSubmission
} from '../models/contactSalesModel.js';

// Get all contact sales submissions
export const getContactSales = async (req: Request, res: Response) => {
    try {
        const submissions = await getAllContactSales();
        res.json({
            success: true,
            data: submissions,
            message: 'Contact sales submissions retrieved successfully'
        });
    } catch (error: any) {
        console.error('Error fetching contact sales:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact sales submissions',
            error: 'Internal server error'
        });
    }
};

// Update contact sales status
export const updateContactSalesStatusHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const submissionId = parseInt(idString || '0');
        
        if (isNaN(submissionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact sales ID'
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

        const submission = await updateContactSalesStatus(submissionId, { status });
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Contact sales submission not found'
            });
        }

        res.json({
            success: true,
            data: submission,
            message: 'Contact sales submission status updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating contact sales status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact sales submission status',
            error: 'Internal server error'
        });
    }
};

// Update contact sales action
export const updateContactSalesActionHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const submissionId = parseInt(idString || '0');
        
        if (isNaN(submissionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact sales ID'
            });
        }

        const { action_made } = req.body;
        
        const submission = await updateContactSalesAction(submissionId, { action_made });
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Contact sales submission not found'
            });
        }

        res.json({
            success: true,
            data: submission,
            message: 'Contact sales submission action updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating contact sales action:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact sales submission action',
            error: 'Internal server error'
        });
    }
};

// Delete contact sales submission
export const deleteContactSalesHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const submissionId = parseInt(idString || '0');
        
        if (isNaN(submissionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact sales ID'
            });
        }

        const submission = await deleteContactSales(submissionId);
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Contact sales submission not found'
            });
        }

        res.json({
            success: true,
            data: submission,
            message: 'Contact sales submission deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting contact sales:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact sales submission',
            error: 'Internal server error'
        });
    }
};

// Submit a new contact sales form
export const submitContactSales = async (req: Request, res: Response) => {
    const { firstName, lastName, email, company, size, useCase, phoneNumber, description } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !company || !size) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: firstName, lastName, email, company, and size are required."
        });
    }

    try {
        const submission = await createSubmission({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            company: company.trim(),
            size,
            useCase: useCase ? useCase.trim() : null,
            phoneNumber: phoneNumber ? phoneNumber.trim() : null,
            description: description ? description.trim() : null
        });

        console.log("Contact sales form submission saved to DB:", submission);

        return res.status(201).json({
            success: true,
            message: "Submission saved successfully.",
            data: submission
        });
    } catch (error: any) {
        console.error("Error in contact sales controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to save details to the database."
        });
    }
};
