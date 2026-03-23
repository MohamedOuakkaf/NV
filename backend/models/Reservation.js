const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'La date de début est obligatoire'],
    },
    endDate: {
      type: Date,
      required: [true, 'La date de fin est obligatoire'],
    },
    totalDays: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['en_attente', 'confirmée', 'annulée', 'terminée'],
      default: 'en_attente',
    },
    notes: {
      type: String,
      default: '',
    },
    pickupLocation: {
      type: String,
      default: '',
    },
    returnLocation: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Calculer automatiquement le nombre de jours et le prix total avant sauvegarde
reservationSchema.pre('save', async function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Chercher le prix de la voiture
    if (this.isNew) {
      const Car = mongoose.model('Car');
      const car = await Car.findById(this.car);
      if (car) {
        this.totalPrice = this.totalDays * car.price;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
