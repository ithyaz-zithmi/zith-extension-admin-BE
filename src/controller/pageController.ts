import type { Request, Response } from 'express';
import {
  getAllPages,
  getPagesByProduct,
  createPage,
  updatePage,
  deletePage,
} from '../models/pageModel.js';
import { getProductById } from '../models/productModel.js';

const VALID_STATUS = ['active', 'inactive'];

export const listPages = async (req: Request, res: Response) => {
  try {
    const productIdParam = req.query.product_id;
    if (productIdParam) {
      const pid = parseInt(String(productIdParam), 10);
      if (!pid) return res.status(400).json({ success: false, message: 'Invalid product_id' });
      const items = await getPagesByProduct(pid);
      return res.json({ success: true, data: items });
    }
    const items = await getAllPages();
    res.json({ success: true, data: items });
  } catch (err: any) {
    console.error('listPages:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pages' });
  }
};

export const createPageHandler = async (req: Request, res: Response) => {
  try {
    const { product_id, name, code, description, url, status } = req.body;
    if (!product_id || !name || !code) {
      return res.status(400).json({ success: false, message: 'product_id, name and code are required' });
    }
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be active or inactive' });
    }
    const product = await getProductById(Number(product_id));
    if (!product) return res.status(400).json({ success: false, message: 'Product does not exist' });

    const page = await createPage({
      product_id: Number(product_id),
      name: String(name).trim(),
      code: String(code).trim(),
      description: description ? String(description).trim() : undefined,
      url: url ? String(url).trim() : undefined,
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: page });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'A page with this code already exists for that product' });
    }
    console.error('createPage:', err);
    res.status(500).json({ success: false, message: 'Failed to create page' });
  }
};

export const updatePageHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id || '0'), 10);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });

    const { product_id, name, code, description, url, status } = req.body;
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be active or inactive' });
    }
    if (product_id !== undefined) {
      const product = await getProductById(Number(product_id));
      if (!product) return res.status(400).json({ success: false, message: 'Product does not exist' });
    }

    const page = await updatePage(id, {
      ...(product_id ? { product_id: Number(product_id) } : {}),
      name,
      code,
      description,
      url,
      status,
    });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'A page with this code already exists for that product' });
    }
    console.error('updatePage:', err);
    res.status(500).json({ success: false, message: 'Failed to update page' });
  }
};

export const deletePageHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id || '0'), 10);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });
    const page = await deletePage(id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err: any) {
    console.error('deletePage:', err);
    res.status(500).json({ success: false, message: 'Failed to delete page' });
  }
};
