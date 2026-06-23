const Joi = require('joi');

// ===== Validation Schemas =====
const itemSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  category: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 2 characters'
    }),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed', 'archived')
    .default('pending'),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium'),
  
  metadata: Joi.object()
    .default({})
});

const itemUpdateSchema = itemSchema.fork(
  ['name', 'description', 'category'], 
  (schema) => schema.optional()
);

// ===== Middleware Functions =====

// Validate Item Creation (POST)
const validateItem = (req, res, next) => {
  const { error, value } = itemSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Request data failed validation',
      errors: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  req.body = value;
  next();
};

// Validate Item Update (PUT)
const validateItemUpdate = (req, res, next) => {
  const { error, value } = itemUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Request data failed validation',
      errors: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  req.body = value;
  next();
};

// Validate ID Parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  // UUID v4 validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Invalid ID format. Must be a valid UUID v4.',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

module.exports = {
  validateItem,
  validateItemUpdate,
  validateId
};