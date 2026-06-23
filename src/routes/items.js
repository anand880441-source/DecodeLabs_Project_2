const express = require('express');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus
} = require('../controllers/itemController');
const { validateItem, validateItemUpdate, validateId } = require('../middleware/validation');

const router = express.Router();

// ===== RESTful Endpoints =====
// Resources are Nouns (items), Methods are Verbs

// GET /api/items - Retrieve all items
router.get('/', getAllItems);

// GET /api/items/:id - Retrieve a specific item
router.get('/:id', validateId, getItemById);

// POST /api/items - Create a new item
router.post('/', validateItem, createItem);

// PUT /api/items/:id - Fully update an item
router.put('/:id', validateId, validateItem, updateItem);

// PATCH /api/items/:id/status - Partially update item status
router.patch('/:id/status', validateId, updateItemStatus);

// DELETE /api/items/:id - Delete an item
router.delete('/:id', validateId, deleteItem);

module.exports = router;