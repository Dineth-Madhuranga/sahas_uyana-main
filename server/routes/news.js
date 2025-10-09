const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news items
router.get('/', async (req, res) => {
  try {
    const { status, category, featured, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    
    const newsItems = await News.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await News.countDocuments(query);
    
    res.json({
      newsItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news items', error: error.message });
  }
});

// Get published news items (public endpoint)
router.get('/published', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    
    const newsItems = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content') // Exclude full content for list view
      .exec();
    
    const total = await News.countDocuments(query);
    
    res.json({
      newsItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching published news', error: error.message });
  }
});

// Get news item by ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news item', error: error.message });
  }
});

// Create new news item
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      image,
      featured,
      tags,
      author
    } = req.body;
    
    const newsItem = new News({
      title,
      description,
      content,
      category,
      image,
      featured: featured || false,
      tags: tags || [],
      author: author || 'Admin'
    });
    
    const savedNewsItem = await newsItem.save();
    res.status(201).json(savedNewsItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating news item', error: error.message });
  }
});

// Update news item
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      image,
      status,
      featured,
      tags
    } = req.body;
    
    const updateData = {
      title,
      description,
      content,
      category,
      image,
      featured,
      tags
    };
    
    // Only update status if provided
    if (status) {
      updateData.status = status;
    }
    
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news item', error: error.message });
  }
});

// Update news item status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news item status', error: error.message });
  }
});

// Delete news item
router.delete('/:id', async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news item', error: error.message });
  }
});

// Get news statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ status: 'published' });
    const draftNews = await News.countDocuments({ status: 'draft' });
    const featuredNews = await News.countDocuments({ featured: true });
    
    const categoryStats = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalNews,
      publishedNews,
      draftNews,
      featuredNews,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news statistics', error: error.message });
  }
});

module.exports = router;
