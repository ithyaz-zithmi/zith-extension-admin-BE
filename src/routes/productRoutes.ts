import { Router } from 'express';
import {
  listProducts,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
} from '../controller/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, listProducts);
router.get('/:id', authMiddleware, getProductHandler);
router.post('/', authMiddleware, createProductHandler);
router.put('/:id', authMiddleware, updateProductHandler);
router.delete('/:id', authMiddleware, deleteProductHandler);

export default router;
