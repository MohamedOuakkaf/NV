const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Car = require('../models/Car');
const Reservation = require('../models/Reservation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/car_rental';

const cars = [
  {
    name: 'Clio V',
    brand: 'Renault',
    model: 'Clio',
    year: 2023,
    price: 35,
    category: 'économique',
    transmission: 'manuelle',
    fuel: 'essence',
    seats: 5,
    availability: true,
    description: 'Parfaite pour la ville, économique et maniable.',
    features: ['Climatisation', 'Bluetooth', 'Caméra de recul'],
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600',
  },
  {
    name: 'Série 3',
    brand: 'BMW',
    model: '320d',
    year: 2022,
    price: 95,
    category: 'berline',
    transmission: 'automatique',
    fuel: 'diesel',
    seats: 5,
    availability: true,
    description: 'Berline premium alliant confort et performance.',
    features: ['GPS', 'Sièges chauffants', 'Régulateur adaptatif', 'Apple CarPlay'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
  },
  {
    name: 'Tiguan',
    brand: 'Volkswagen',
    model: 'Tiguan R-Line',
    year: 2023,
    price: 80,
    category: 'SUV',
    transmission: 'automatique',
    fuel: 'diesel',
    seats: 5,
    availability: true,
    description: 'SUV spacieux et confortable pour famille.',
    features: ['Toit panoramique', '4x4', 'Caméra 360°', 'Parking automatique'],
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600',
  },
  {
    name: 'Mustang GT',
    brand: 'Ford',
    model: 'Mustang GT 5.0',
    year: 2022,
    price: 150,
    category: 'sport',
    transmission: 'manuelle',
    fuel: 'essence',
    seats: 4,
    availability: true,
    description: 'La légendaire muscle car américaine.',
    features: ['V8 450ch', 'Mode Sport+', 'Échappement Actif', 'Launch Control'],
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600',
  },
  {
    name: 'Classe S',
    brand: 'Mercedes-Benz',
    model: 'S500',
    year: 2023,
    price: 250,
    category: 'luxe',
    transmission: 'automatique',
    fuel: 'hybride',
    seats: 5,
    availability: true,
    description: 'Le summum du luxe automobile.',
    features: ['Massage siège', 'MBUX', 'Conduite semi-autonome', 'Burmester Audio'],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600',
  },
  {
    name: 'Model 3',
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    price: 120,
    category: 'berline',
    transmission: 'automatique',
    fuel: 'électrique',
    seats: 5,
    availability: true,
    description: 'La berline électrique la plus vendue au monde.',
    features: ['Autopilot', 'Supercharge', '580km d\'autonomie', 'Over-the-air updates'],
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600',
  },
  {
    name: 'Duster',
    brand: 'Dacia',
    model: 'Duster 4x4',
    year: 2023,
    price: 50,
    category: 'SUV',
    transmission: 'manuelle',
    fuel: 'diesel',
    seats: 5,
    availability: true,
    description: 'Le meilleur rapport qualité/prix du marché.',
    features: ['4x4', 'Climatisation', 'GPS', 'USB'],
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=600',
  },
  {
    name: 'Cayenne',
    brand: 'Porsche',
    model: 'Cayenne S',
    year: 2022,
    price: 300,
    category: 'luxe',
    transmission: 'automatique',
    fuel: 'essence',
    seats: 5,
    availability: true,
    description: 'Le SUV sport de référence.',
    features: ['PASM', 'Sport Chrono', 'Toit panoramique', 'Bose Audio'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
  },
  {
    name: 'Transit',
    brand: 'Ford',
    model: 'Transit Custom',
    year: 2022,
    price: 70,
    category: 'utilitaire',
    transmission: 'manuelle',
    fuel: 'diesel',
    seats: 3,
    availability: true,
    description: 'Véhicule utilitaire idéal pour les déménagements.',
    features: ['Grand volume', 'Rampe de chargement', 'GPS', 'Climatisation'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connecté à MongoDB...');

    // Supprimer les données existantes
    await User.deleteMany({});
    await Car.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Données supprimées.');

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@carrental.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      phone: '+212600000000',
    });
    console.log(`Admin créé : ${admin.email}`);

    const client = await User.create({
      name: 'Client Test',
      email: 'client@test.com',
      password: 'client123',
      role: 'client',
      phone: '+212611223344',
    });
    console.log(`Client créé : ${client.email}`);

    // Insérer les voitures
    const insertedCars = await Car.insertMany(cars);
    console.log(`${insertedCars.length} voitures insérées.`);

    console.log('\n✅ Base de données initialisée avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Admin     → ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log(`Client    → ${client.email} / client123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Erreur seeder:', error.message);
    process.exit(1);
  }
};

seedDB();
