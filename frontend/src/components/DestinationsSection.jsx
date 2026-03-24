import React, { useState, useEffect } from 'react';
import api from '../config/api';

const defaultDestinations = [
  {
    name: 'Casablanca',
    desc: 'Cœur économique vibrant du Maroc, célèbre pour la majestueuse Mosquée Hassan II érigée sur l\'océan et son fascinant héritage architectural Art Déco qui se mêle à la modernité.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Marrakech',
    desc: 'La Ville Ocre, véritable joyau historique abritant la célèbre place frénétique Jemaa el-Fna, la majestueuse mosquée Koutoubia et ses somptueux jardins luxuriants.',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Rabat',
    desc: 'Capitale impériale majestueuse et paisible, reconnue pour l\'imposante Tour Hassan, le somptueux Mausolée et l\'historique Kasbah des Oudayas surplombant l\'Atlantique.',
    image: 'https://images.trvl-media.com/place/6114800/9cbd00f1-c248-4ce6-936d-5698f58a1cb5.jpg'
  },
  {
    name: 'Tanger',
    desc: 'La perle du Nord à la croisée des mondes, offrant ses mythiques grottes d\'Hercule, son port authentique et sa médina envoûtante face au détroit de Gibraltar.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cuevas_de_H%C3%A9rcules%2C_Cabo_Espartel%2C_Marruecos%2C_2015-12-11%2C_DD_22-24_HDR.JPG'
  },
  {
    name: 'Fès',
    desc: 'Capitale spirituelle et culturelle du royaume, réputée mondialement pour sa médina millénaire labyrinthique, ses tanneries et la majestueuse porte Bab Boujloud.',
    image: 'https://www.lavieeco.com/wp-content/uploads/2021/11/P20-2-2048x1479.jpg'
  },
  {
    name: 'Meknès',
    desc: 'L\'ancienne cité impériale ismaélienne, célèbre pour ses hautes murailles protectrices, l\'imposante porte Bab Mansour et ses vastes écuries royales chargées d\'histoire.',
    image: 'https://www.fez-guide.com/wp-content/uploads/2016/09/bab-mansour-meknes-1920.jpg'
  }
];

function DestinationsSection() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/destinations');
        if (data.destinations && data.destinations.length > 0) {
          setDestinations(data.destinations);
        } else {
          setDestinations(defaultDestinations);
        }
      } catch (error) {
        console.error('Erreur API Destinations:', error);
        setDestinations(defaultDestinations);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <section id="destinations" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Explorez le <span className="text-red-500">Maroc</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Louez une voiture et découvrez les plus belles destinations du Maroc
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            destinations.map((destination, index) => (
              <div key={destination._id || index} className="relative h-80 rounded-lg overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-2">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${destination.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-95 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 font-playfair">{destination.name}</h3>
                  <p className="text-gray-200 text-sm mb-4 line-clamp-3">{destination.desc}</p>
                  <div className="flex items-center text-red-500 font-semibold text-sm group-hover:text-red-400 transition-colors uppercase tracking-wider">
                    Louer une voiture <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default DestinationsSection;
