import { Request, Response } from 'express';
import Category from '../models/category';
import Product from '../models/product';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { ExtendedRequest } from '../utils/types';


export const createCategory = async (req: ExtendedRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ error: 'Category already exists' });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file, "categories");

    const category = await Category.create({
      name,
      description,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getAllCategories = async (req: ExtendedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const updateCategory = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, removeImage } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (name) category.name = name;
    if (description) category.description = description;

    if (removeImage === 'true' && !req.file) {
      await deleteFromCloudinary(category.image);
      category.image = '';
    }

    if (req.file) {
      await deleteFromCloudinary(category.image);
      const imageUrl = await uploadToCloudinary(req.file, "categories");
      category.image = imageUrl;
    }

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      res.status(400).json({
        error: `Cannot delete category with ${productCount} products. Please reassign or delete products first.`
      });
      return;
    }

    await deleteFromCloudinary(category.image);

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
