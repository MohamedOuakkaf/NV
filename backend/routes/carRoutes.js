const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getBrands,
} = require('../controllers/carController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getCars);
router.get('/brands', getBrands);
router.get('/:id', getCarById);

// Admin only
router.post('/', protect, adminOnly, upload.single('image'), createCar);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;
