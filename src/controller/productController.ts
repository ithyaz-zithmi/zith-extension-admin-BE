import type { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../models/productModel.js';

const VALID_STATUS = ['active', 'inactive'];

export const listProducts = async (_req: Request, res: Response) => {
  try {
    const items = await getAllProducts();
    res.json({ success: true, data: items });
  } catch (err: any) {
    console.error('listProducts:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const { name, code, description, status } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'name and code are required' });
    }
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be active or inactive' });
    }
    const product = await createProduct({
      name: String(name).trim(),
      code: String(code).trim(),
      description: description ? String(description).trim() : undefined,
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'A product with this code already exists' });
    }
    console.error('createProduct:', err);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id || '0'), 10);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });

    const { name, code, description, status } = req.body;
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be active or inactive' });
    }

    const product = await updateProduct(id, { name, code, description, status });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'A product with this code already exists' });
    }
    console.error('updateProduct:', err);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id || '0'), 10);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });
    const product = await deleteProduct(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err: any) {
    console.error('deleteProduct:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

export const getProductHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id || '0'), 10);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err: any) {
    console.error('getProduct:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};
