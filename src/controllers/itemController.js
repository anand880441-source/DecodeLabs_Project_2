const ItemModel = require('../models/itemModel');

// ===== GET /api/items =====
const getAllItems = (req, res) => {
  const { status, limit = 100, offset = 0 } = req.query;
  
  let items = ItemModel.findAll();
  
  // Filter by status if provided
  if (status) {
    items = items.filter(item => item.status === status);
  }
  
  // Pagination
  const start = parseInt(offset);
  const end = start + parseInt(limit);
  const paginatedItems = items.slice(start, end);
  
  res.status(200).json({
    status: 200,
    data: paginatedItems,
    pagination: {
      total: items.length,
      limit: parseInt(limit),
      offset: start,
      returned: paginatedItems.length
    },
    timestamp: new Date().toISOString()
  });
};

// ===== GET /api/items/:id =====
const getItemById = (req, res) => {
  const { id } = req.params;
  const item = ItemModel.findById(id);
  
  if (!item) {
    return res.status(404).json({
      status: 404,
      error: 'Not Found',
      message: `Item with ID ${id} does not exist`
    });
  }
  
  res.status(200).json({
    status: 200,
    data: item,
    timestamp: new Date().toISOString()
  });
};

// ===== POST /api/items =====
const createItem = (req, res) => {
  const { name, description, category, status, priority, metadata } = req.body;
  
  const newItem = ItemModel.create({
    name,
    description,
    category,
    status: status || 'pending',
    priority: priority || 'medium',
    metadata: metadata || {}
  });
  
  res.status(201).json({
    status: 201,
    message: 'Item created successfully',
    data: newItem.toJSON(),
    timestamp: new Date().toISOString()
  });
};

// ===== PUT /api/items/:id =====
const updateItem = (req, res) => {
  const { id } = req.params;
  const { name, description, category, status, priority, metadata } = req.body;
  
  const updated = ItemModel.update(id, {
    name,
    description,
    category,
    status,
    priority,
    metadata
  });
  
  if (!updated) {
    return res.status(404).json({
      status: 404,
      error: 'Not Found',
      message: `Item with ID ${id} does not exist`
    });
  }
  
  res.status(200).json({
    status: 200,
    message: 'Item updated successfully',
    data: updated,
    timestamp: new Date().toISOString()
  });
};

// ===== PATCH /api/items/:id/status =====
const updateItemStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Status is required in request body'
    });
  }
  
  const validStatuses = ['pending', 'in-progress', 'completed', 'archived'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }
  
  const updated = ItemModel.update(id, { status });
  
  if (!updated) {
    return res.status(404).json({
      status: 404,
      error: 'Not Found',
      message: `Item with ID ${id} does not exist`
    });
  }
  
  res.status(200).json({
    status: 200,
    message: 'Item status updated successfully',
    data: updated,
    timestamp: new Date().toISOString()
  });
};

// ===== DELETE /api/items/:id =====
const deleteItem = (req, res) => {
  const { id } = req.params;
  
  const existing = ItemModel.findById(id);
  if (!existing) {
    return res.status(404).json({
      status: 404,
      error: 'Not Found',
      message: `Item with ID ${id} does not exist`
    });
  }
  
  ItemModel.delete(id);
  
  res.status(204).send(); // 204 No Content - successful deletion
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus
};