const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'La marque est obligatoire'],
      trim: true,
    },
    model: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    price: {
      type: Number,
      required: [true, 'Le prix par jour est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    category: {
      type: String,
      enum: ['économique', 'berline', 'SUV', 'sport', 'luxe', 'utilitaire'],
      default: 'berline',
    },
    transmission: {
      type: String,
      enum: ['manuelle', 'automatique'],
      default: 'manuelle',
    },
    fuel: {
      type: String,
      enum: ['essence', 'diesel', 'électrique', 'hybride'],
      default: 'essence',
    },
    seats: {
      type: Number,
      default: 5,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Index pour la recherche et le filtrage
carSchema.index({ brand: 1, price: 1, availability: 1 });

module.exports = mongoose.model('Car', carSchema);
