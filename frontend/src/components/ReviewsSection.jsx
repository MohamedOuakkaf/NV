import React from 'react';

function ReviewsSection() {
  const reviews = [
    { name: 'Mohammed Khaled', role: 'Voyageur d\'affaires', text: 'Excellent service, voiture en parfait état. Je recommande LUXCAR!', avatar: 'MK' },
    { name: 'Sophia Ahmed', role: 'Touriste', text: 'Tarifs compétitifs et processus simple. Très satisfait!', avatar: 'SA' },
    { name: 'Nadia Benali', role: 'Voyageur régulier', text: 'Voitures modernes et personnel très professionnel!', avatar: 'NB' },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Avis de nos <span className="text-red-500">clients</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-800/80 border border-red-500/10 p-6 rounded-lg hover:border-red-500 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-red-500"></i>
                ))}
              </div>
              <p className="text-gray-300 italic mb-4 text-sm">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
