import React from 'react';

function DestinationsSection() {
  const destinations = [
    {
      name: 'Casablanca',
      desc: 'Cœur économique vibrant, célèbre pour la majestueuse Mosquée Hassan II et son architecture Art Déco.',
      image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Marrakech',
      desc: 'La Ville Ocre, joyau historique abritant la célèbre place Jemaa el-Fna et la mosquée Koutoubia.',
      image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Rabat',
      desc: 'Capitale impériale majestueuse, reconnue pour la Tour Hassan et l\'historique Kasbah des Oudayas.',
      image: 'https://images.trvl-media.com/place/6114800/9cbd00f1-c248-4ce6-936d-5698f58a1cb5.jpg'
    },
    {
      name: 'Tanger',
      desc: 'La perle du Nord à la croisée des mondes, offrant ses grottes d\'Hercule et sa médina envoûtante.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cuevas_de_H%C3%A9rcules%2C_Cabo_Espartel%2C_Marruecos%2C_2015-12-11%2C_DD_22-24_HDR.JPG'
    },
    {
      //ddsd
      //EEED
      name: 'Fès',
      desc: 'Capitale spirituelle du royaume, réputée pour sa medina millénaire et la majestueuse porte Bab Boujloud.',
      image: 'https://www.lavieeco.com/wp-content/uploads/2021/11/P20-2-2048x1479.jpg'
    },
    {
      name: 'Meknès',
      desc: 'L\'ancienne cité impériale ismaélienne, célèbre pour l\'imposante porte Bab Mansour et ses écuries.',
      image: 'https://www.fez-guide.com/wp-content/uploads/2016/09/bab-mansour-meknes-1920.jpg'
    }
  ];

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
          {destinations.map((destination, index) => (
            <div key={index} className="relative h-80 rounded-lg overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-2">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${destination.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-95 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-playfair">{destination.name}</h3>
                <p className="text-gray-200 text-sm mb-4">{destination.desc}</p>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm w-fit transition-all transform hover:-translate-y-1">
                  Louer une voiture
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DestinationsSection;
