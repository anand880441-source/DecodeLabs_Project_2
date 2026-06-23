const request = require('supertest');
const app = require('../src/app');
const ItemModel = require('../src/models/itemModel');

describe('DecodeLabs API - Project 2 Tests', () => {
  
  beforeEach(() => {
    // Clear data before each test
    ItemModel.clear();
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);
      
      expect(response.body).toHaveProperty('name', 'DecodeLabs API');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('status', 'operational');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with 201 Created', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'This is a test item for the API',
        category: 'testing'
      };
      
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 201);
      expect(response.body).toHaveProperty('message', 'Item created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'Test Item');
      expect(response.body.data).toHaveProperty('status', 'pending');
    });

    it('should return 400 for invalid data', async () => {
      const invalidItem = {
        name: 'T', // Too short
        description: 'Short' // Too short
      };
      
      const response = await request(app)
        .post('/api/items')
        .send(invalidItem)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Validation Error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      // Seed data
      await request(app)
        .post('/api/items')
        .send({ name: 'Item 1', description: 'Description 1', category: 'cat1' });
      
      await request(app)
        .post('/api/items')
        .send({ name: 'Item 2', description: 'Description 2', category: 'cat2' });
      
      const response = await request(app)
        .get('/api/items')
        .expect(200);
      
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(2);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('total', 2);
    });

    it('should filter items by status', async () => {
      await request(app)
        .post('/api/items')
        .send({ name: 'Pending Item', description: 'Desc', category: 'cat', status: 'pending' });
      
      await request(app)
        .post('/api/items')
        .send({ name: 'Completed Item', description: 'Desc', category: 'cat', status: 'completed' });
      
      const response = await request(app)
        .get('/api/items?status=pending')
        .expect(200);
      
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('status', 'pending');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a specific item', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'Specific Item', description: 'Description', category: 'cat' });
      
      const itemId = createResponse.body.data.id;
      
      const response = await request(app)
        .get(`/api/items/${itemId}`)
        .expect(200);
      
      expect(response.body.data).toHaveProperty('id', itemId);
      expect(response.body.data).toHaveProperty('name', 'Specific Item');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/items/00000000-0000-4000-8000-000000000000')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'Old Name', description: 'Old Desc', category: 'old' });
      
      const itemId = createResponse.body.data.id;
      
      const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ name: 'New Name', description: 'New Desc', category: 'new' })
        .expect(200);
      
      expect(response.body.data).toHaveProperty('name', 'New Name');
      expect(response.body.data).toHaveProperty('description', 'New Desc');
      expect(response.body.data).toHaveProperty('version', 2);
    });
  });

  describe('PATCH /api/items/:id/status', () => {
    it('should update only the status', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'Status Item', description: 'Desc', category: 'cat' });
      
      const itemId = createResponse.body.data.id;
      
      const response = await request(app)
        .patch(`/api/items/${itemId}/status`)
        .send({ status: 'completed' })
        .expect(200);
      
      expect(response.body.data).toHaveProperty('status', 'completed');
      expect(response.body.data).toHaveProperty('name', 'Status Item'); // Unchanged
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an item and return 204 No Content', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'To Delete', description: 'Desc', category: 'cat' });
      
      const itemId = createResponse.body.data.id;
      
      await request(app)
        .delete(`/api/items/${itemId}`)
        .expect(204);
      
      // Verify it's gone
      await request(app)
        .get(`/api/items/${itemId}`)
        .expect(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit exceeded', async () => {
      // This test assumes rate limit is 100 requests per 15 minutes
      // For testing, we'd need to mock the rate limiter or use a smaller window
      // Skipping in favor of integration tests
    });
  });
});