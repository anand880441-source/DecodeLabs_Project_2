const express = require('express');
const itemRoutes = require('./items');

const router = express.Router();

// API Info Route (RESTful documentation)
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'DecodeLabs API',
    version: process.env.API_VERSION || 'v1',
    description: 'Industrial Training Kit - Project 2 Backend API',
    endpoints: {
      items: {
        base: '/api/items',
        methods: {
          GET: '/api/items - Get all items',
          GET: '/api/items/:id - Get a specific item',
          POST: '/api/items - Create a new item',
          PUT: '/api/items/:id - Update an item',
          DELETE: '/api/items/:id - Delete an item',
          PATCH: '/api/items/:id/status - Update item status'
        }
      },
      health: '/health - Service health check'
    },
    documentation: 'https://github.com/decodelabs/project2-api',
    status: 'operational'
  });
});

// Mount item routes
router.use('/items', itemRoutes);

module.exports = router;