const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET all lost and found items
router.get('/', itemController.getAllItems);

// POST a new lost or found report
router.post('/', itemController.createItem);

// GET a single item's details by ID
router.get('/:id', itemController.getItemById);

// PUT to update an item (e.g., changing status from Active to Claimed)
router.put('/:id', itemController.updateItem);

// DELETE a report
router.delete('/:id', itemController.deleteItem);

module.exports = router;