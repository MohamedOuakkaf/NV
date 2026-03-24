const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la destination est obligatoire'],
      trim: true,
      unique: true,
    },
    desc: {
      type: String,
      required: [true, 'La description est obligatoire'],
    },
    image: {
      type: String,
      required: [true, 'L\'URL de l\'image est obligatoire'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
