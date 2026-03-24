require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const destinations = [
  {
    name: 'Casablanca',
    desc: 'Cœur économique vibrant du Maroc, célèbre pour la majestueuse Mosquée Hassan II.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800',
    isActive: true
  },
  {
    name: 'Marrakech',
    desc: 'La Ville Ocre, joyau historique abritant la place Jemaa el-Fna et la Koutoubia.',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800',
    isActive: true
  },
  {
    name: 'Rabat',
    desc: 'Capitale impériale majestueuse, reconnue pour la Tour Hassan et le Mausolée.',
    image: 'https://images.trvl-media.com/place/6114800/9cbd00f1-c248-4ce6-936d-5698f58a1cb5.jpg',
    isActive: true
  },
  {
    name: 'Tanger',
    desc: 'La perle du Nord à la croisée des mondes, offrant ses mythiques grottes d\'Hercule.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cuevas_de_H%C3%A9rcules%2C_Cabo_Espartel%2C_Marruecos%2C_2015-12-11%2C_DD_22-24_HDR.JPG',
    isActive: true
  },
  {
    name: 'Fès',
    desc: 'Capitale spirituelle, réputée pour sa médina millénaire et ses tanneries.',
    image: 'https://www.lavieeco.com/wp-content/uploads/2021/11/P20-2-2048x1479.jpg',
    isActive: true
  },
  {
    name: 'Meknès',
    desc: 'Cité ismaélienne, célèbre pour l\'imposante porte Bab Mansour.',
    image: 'https://www.fez-guide.com/wp-content/uploads/2016/09/bab-mansour-meknes-1920.jpg',
    isActive: true
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB Connected');
  
  // Clear existing to avoid duplicates if running multiple times during testing
  await Destination.deleteMany();
  
  await Destination.insertMany(destinations);
  console.log('Destinations ajoutées avec succès');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
