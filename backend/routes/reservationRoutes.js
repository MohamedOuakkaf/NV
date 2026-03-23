const express = require('express');
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
  getStats,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Client
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.put('/:id/cancel', protect, cancelReservation);

// Admin
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getAllReservations);
router.put('/:id/status', protect, adminOnly, updateReservationStatus);

// Partagé (admin ou propriétaire)
router.get('/:id', protect, getReservationById);

module.exports = router;
