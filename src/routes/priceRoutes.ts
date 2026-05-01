import { Router } from 'express';
import { 
    getPriceSettings, 
    createPriceSettingHandler, 
    updatePriceSettingHandler, 
    deletePriceSettingHandler 
} from '../controller/priceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get all price settings (protected)
router.get('/', authMiddleware, getPriceSettings);

// Create new price setting (protected)
router.post('/', authMiddleware, createPriceSettingHandler);

// Update price setting (protected)
router.put('/:id', authMiddleware, updatePriceSettingHandler);

// Delete price setting (protected)
router.delete('/:id', authMiddleware, deletePriceSettingHandler);

export default router;
