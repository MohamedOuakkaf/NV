const Destination = require('../models/Destination');

// @desc    Obtenir toutes les destinations actives (publiques)
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.all !== 'true') {
      filter.isActive = true;
    }
    const destinations = await Destination.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Créer une destination
// @route   POST /api/destinations
// @access  Admin
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, message: 'Destination ajoutée.', destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Modifier une destination
// @route   PUT /api/destinations/:id
// @access  Admin
const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) return res.status(404).json({ success: false, message: 'Introuvable.' });
    res.json({ success: true, message: 'Destination mise à jour.', destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer une destination
// @route   DELETE /api/destinations/:id
// @access  Admin
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: 'Introuvable.' });
    res.json({ success: true, message: 'Destination supprimée.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDestinations, createDestination, updateDestination, deleteDestination };
