const Car = require('../models/Car');
const Reservation = require('../models/Reservation');
const path = require('path');
const fs = require('fs');

// @desc    Obtenir toutes les voitures (avec pagination et filtres)
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Construction des filtres dynamiques
    const filter = {};
    if (req.query.availability !== undefined) {
      filter.availability = req.query.availability === 'true';
    } else if (req.query.all !== 'true') {
      filter.availability = true;
    }
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Exclusion des véhicules ayant des réservations en conflit sur les dates demandées
    if (req.query.startDate && req.query.endDate) {
      const start = new Date(req.query.startDate);
      const end = new Date(req.query.endDate);
      
      const conflictingReservations = await Reservation.find({
        status: { $in: ['en_attente', 'confirmée'] },
        $or: [
          // Conflit si la réservation existante chevauche la période demandée
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      });
      
      const conflictingCarIds = conflictingReservations.map(r => r.car);
      if (conflictingCarIds.length > 0) {
        filter._id = { $nin: conflictingCarIds };
      }
    }

    // Tri
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const cars = await Car.find(filter).sort(sort).skip(skip).limit(limit);
    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      count: cars.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      cars,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir une voiture par ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });
    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ajouter une voiture (admin)
// @route   POST /api/cars
// @access  Admin
const createCar = async (req, res) => {
  try {
    const carData = { ...req.body };

    // Si une image est uploadée
    if (req.file) {
      carData.image = `/uploads/${req.file.filename}`;
    }

    // Convertir features si envoyé en string JSON
    if (typeof carData.features === 'string') {
      try { carData.features = JSON.parse(carData.features); } catch { carData.features = []; }
    }

    const car = await Car.create(carData);
    res.status(201).json({ success: true, message: 'Voiture ajoutée avec succès.', car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Modifier une voiture (admin)
// @route   PUT /api/cars/:id
// @access  Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    const updateData = { ...req.body };

    // Nouvelle image uploadée
    if (req.file) {
      // Supprimer l'ancienne image
      if (car.image && car.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', car.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof updateData.features === 'string') {
      try { updateData.features = JSON.parse(updateData.features); } catch { delete updateData.features; }
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Voiture mise à jour.', car: updatedCar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer une voiture (admin)
// @route   DELETE /api/cars/:id
// @access  Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Voiture introuvable.' });

    // Supprimer l'image associée
    if (car.image && car.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', car.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await car.deleteOne();
    res.json({ success: true, message: 'Voiture supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir les marques disponibles
// @route   GET /api/cars/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getBrands };
