import { Router } from 'express';
import { 
    getDemoRequests, 
    updateDemoRequestStatusHandler, 
    updateDemoRequestActionHandler,
    deleteDemoRequestHandler 
} from '../controller/demoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get all demo requests (protected)
router.get('/', authMiddleware, getDemoRequests);

// Update demo request status (protected)
router.put('/:id/status', authMiddleware, updateDemoRequestStatusHandler);

// Update demo request action (protected)
router.put('/:id/action', authMiddleware, updateDemoRequestActionHandler);

// Delete demo request (protected)
router.delete('/:id', authMiddleware, deleteDemoRequestHandler);

export default router;
