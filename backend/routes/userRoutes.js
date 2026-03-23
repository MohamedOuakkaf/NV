const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Routes client
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Routes admin
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;
