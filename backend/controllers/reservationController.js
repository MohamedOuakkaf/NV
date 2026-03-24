const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

// @desc    Créer une réservation (client)
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, returnLocation, notes } = req.body;

    // Vérifier que la voiture existe et est disponible
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });
    if (!car.availability) {
      return res.status(400).json({ success: false, message: 'Cette voiture est indisponible.' });
    }

    // Vérifier cohérence des dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début.' });
    }
    if (start < new Date()) {
      return res.status(400).json({ success: false, message: 'La date de début ne peut pas être dans le passé.' });
    }

    // Vérifier chevauchement avec d'autres réservations confirmées
    const overlap = await Reservation.findOne({
      car: carId,
      status: { $in: ['en_attente', 'confirmée'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });
    if (overlap) {
      return res.status(400).json({
        success: false,
        message: 'Cette voiture est déjà réservée pour ces dates.',
      });
    }

    // Calculer le nombre de jours et le prix total
    const totalDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * car.price;

    const reservation = await Reservation.create({
      user: req.user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      pickupLocation,
      returnLocation,
      notes,
    });

    await reservation.populate(['user', 'car']);

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès.',
      reservation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Voir toutes les réservations (admin)
// @route   GET /api/reservations
// @access  Admin
const getAllReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .populate('car', 'name brand image price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(filter);

    res.json({
      success: true,
      count: reservations.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Voir mes réservations (client)
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('car', 'name brand image price category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/reservations/:id
// @access  Private
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car');

    if (!reservation) return res.status(404).json({ success: false, message: 'Réservation introuvable.' });

    // Vérifier que c'est le bon utilisateur ou un admin
    if (req.user.role !== 'admin' && reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }

    res.json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour le statut d'une réservation (admin)
// @route   PUT /api/reservations/:id/status
// @access  Admin
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['en_attente', 'confirmée', 'annulée', 'terminée'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Réservation introuvable.' });

    const oldStatus = reservation.status;
    reservation.status = status;
    await reservation.save();

    // Remettre la voiture disponible si annulée ou terminée
    if (['annulée', 'terminée'].includes(status) && !['annulée', 'terminée'].includes(oldStatus)) {
      await Car.findByIdAndUpdate(reservation.car, { availability: true });
    }
    // Rendre indisponible si on reconfirme
    if (status === 'confirmée' && ['annulée', 'terminée'].includes(oldStatus)) {
      await Car.findByIdAndUpdate(reservation.car, { availability: false });
    }

    await reservation.populate(['user', 'car']);
    res.json({ success: true, message: 'Statut mis à jour.', reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Annuler sa propre réservation (client)
// @route   PUT /api/reservations/:id/cancel
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Réservation introuvable.' });

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }

    if (['annulée', 'terminée'].includes(reservation.status)) {
      return res.status(400).json({ success: false, message: 'Cette réservation ne peut plus être annulée.' });
    }

    reservation.status = 'annulée';
    await reservation.save();

    // Remettre la voiture disponible
    await Car.findByIdAndUpdate(reservation.car, { availability: true });

    res.json({ success: true, message: 'Réservation annulée.', reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stats pour le dashboard admin
// @route   GET /api/reservations/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'en_attente' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmée' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'annulée' });
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ availability: true });

    // Revenu total estimé (réservations confirmées + terminées)
    const revenueResult = await Reservation.aggregate([
      { $match: { status: { $in: ['confirmée', 'terminée'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalReservations,
        pendingReservations,
        confirmedReservations,
        cancelledReservations,
        totalCars,
        availableCars,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
  getStats,
};
