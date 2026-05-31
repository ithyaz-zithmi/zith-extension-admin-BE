import { Router } from 'express';
import {
  listPages,
  createPageHandler,
  updatePageHandler,
  deletePageHandler,
} from '../controller/pageController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, listPages);
router.post('/', authMiddleware, createPageHandler);
router.put('/:id', authMiddleware, updatePageHandler);
router.delete('/:id', authMiddleware, deletePageHandler);

export default router;
