import React from 'react';

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212600000000?text=Bonjour%20LUXCAR%20je%20voudrais%20une%20réservation"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-40"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}

export default WhatsAppButton;
