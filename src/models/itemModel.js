const { v4: uuidv4 } = require('uuid');

// ===== In-Memory Data Store =====
// In production, this would be a database
const items = new Map();

// ===== Item Model =====
class Item {
  constructor({ name, description, category, status = 'pending', priority = 'medium', metadata = {} }) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.category = category;
    this.status = status; // pending, in-progress, completed, archived
    this.priority = priority; // low, medium, high, urgent
    this.metadata = metadata;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    this.version = 1;
  }

  update(data) {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.category) this.category = data.category;
    if (data.status) this.status = data.status;
    if (data.priority) this.priority = data.priority;
    if (data.metadata) this.metadata = { ...this.metadata, ...data.metadata };
    this.updatedAt = new Date().toISOString();
    this.version += 1;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      status: this.status,
      priority: this.priority,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version
    };
  }
}

// ===== Data Access Methods =====
const ItemModel = {
  // Create
  create: (data) => {
    const item = new Item(data);
    items.set(item.id, item);
    return item;
  },

  // Read All
  findAll: () => {
    return Array.from(items.values()).map(item => item.toJSON());
  },

  // Read One
  findById: (id) => {
    const item = items.get(id);
    return item ? item.toJSON() : null;
  },

  // Update
  update: (id, data) => {
    const item = items.get(id);
    if (!item) return null;
    item.update(data);
    return item.toJSON();
  },

  // Delete
  delete: (id) => {
    return items.delete(id);
  },

  // Filter by status
  findByStatus: (status) => {
    return Array.from(items.values())
      .filter(item => item.status === status)
      .map(item => item.toJSON());
  },

  // Count total
  count: () => items.size,

  // Clear all (for testing)
  clear: () => items.clear()
};

module.exports = ItemModel;