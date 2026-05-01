import { Router } from 'express';
import { 
    getStatusConfigs,
    createStatusConfigHandler,
    updateStatusConfigHandler,
    deleteStatusConfigHandler,
    getActionConfigs,
    createActionConfigHandler,
    updateActionConfigHandler,
    deleteActionConfigHandler
} from '../controller/statusController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Status Configuration Routes (protected)
router.get('/status', authMiddleware, getStatusConfigs);
router.post('/status', authMiddleware, createStatusConfigHandler);
router.put('/status/:id', authMiddleware, updateStatusConfigHandler);
router.delete('/status/:id', authMiddleware, deleteStatusConfigHandler);

// Action Configuration Routes (protected)
router.get('/actions', authMiddleware, getActionConfigs);
router.post('/actions', authMiddleware, createActionConfigHandler);
router.put('/actions/:id', authMiddleware, updateActionConfigHandler);
router.delete('/actions/:id', authMiddleware, deleteActionConfigHandler);

export default router;
