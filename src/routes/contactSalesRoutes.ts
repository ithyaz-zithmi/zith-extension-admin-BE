import { Router } from 'express';
import { 
    getContactSales, 
    updateContactSalesStatusHandler, 
    updateContactSalesActionHandler,
    deleteContactSalesHandler,
    submitContactSales
} from '../controller/contactSalesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get all contact sales submissions (protected)
router.get('/', authMiddleware, getContactSales);

// Update status (protected)
router.put('/:id/status', authMiddleware, updateContactSalesStatusHandler);

// Update action (protected)
router.put('/:id/action', authMiddleware, updateContactSalesActionHandler);

// Delete submission (protected)
router.delete('/:id', authMiddleware, deleteContactSalesHandler);

// Public route to submit a contact sales request (unprotected)
router.post('/', submitContactSales);

export default router;
