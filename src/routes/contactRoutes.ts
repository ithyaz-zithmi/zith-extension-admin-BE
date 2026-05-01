import { Router } from 'express';
import { 
    getContactMessages, 
    markMessageAsReadHandler, 
    deleteContactMessage, 
    createContactMessage,
    updateContactStatusHandler,
    updateContactActionHandler
} from '../controller/contactController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get all contact submissions (protected)
router.get('/messages', authMiddleware, getContactMessages);

// Mark message as read (protected)
router.patch('/messages/:id/read', authMiddleware, markMessageAsReadHandler);

// Delete contact submission (protected)
router.delete('/messages/:id', authMiddleware, deleteContactMessage);

// Update contact status (protected)
router.put('/messages/:id/status', authMiddleware, updateContactStatusHandler);

// Update contact action (protected)
router.put('/messages/:id/action', authMiddleware, updateContactActionHandler);

// Create new contact submission (public - for your website contact form)
router.post('/submit', createContactMessage);

export default router;
