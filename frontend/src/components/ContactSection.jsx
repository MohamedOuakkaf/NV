import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, User, MessageSquare, CheckCircle, Send } from 'lucide-react';

function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!contactForm.name.trim()) newErrors.name = "Le nom est requis.";
    if (!contactForm.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!validateEmail(contactForm.email)) {
      newErrors.email = "Le format de l'email est invalide.";
    }
    if (!contactForm.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis.";
    if (!contactForm.message.trim()) newErrors.message = "Le message ne peut pas être vide.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit Action
    setIsSubmitting(true);
    
    try {
      await fetch("https://formsubmit.co/ajax/okfmohammed9@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "_captcha": "false",
          "Type de notification": "Nouveau Message de Contact - LUXCAR",
          "Nom du client": contactForm.name,
          "Email": contactForm.email,
          "Téléphone": contactForm.phone,
          "Message": contactForm.message
        })
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
            Nous <span className="text-red-500">Contacter</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre réservation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 animate-fade-in-up">
                <CheckCircle className="text-green-500 w-20 h-20" />
                <h3 className="text-2xl font-bold text-white font-playfair">Merci !</h3>
                <p className="text-gray-300">Votre message a été envoyé avec succès.<br/>Nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 font-playfair border-b border-gray-700 pb-4">Envoyez-nous un message</h3>
                
                <div className="space-y-1">
                  <label className="text-gray-300 block text-sm font-semibold ml-1">Nom complet *</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-500 group-focus-within:text-red-500'}`} />
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className={`w-full bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-red-500'} rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-red-500'} transition-all shadow-inner`}
                      placeholder="Ex: Mohammed Alami"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1 ml-1 animate-fade-in-up">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-gray-300 block text-sm font-semibold ml-1">Email *</label>
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-red-500'}`} />
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className={`w-full bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-red-500'} rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-red-500'} transition-all shadow-inner`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1 animate-fade-in-up">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 block text-sm font-semibold ml-1">Téléphone *</label>
                    <div className="relative group">
                      <Phone className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${errors.phone ? 'text-red-400' : 'text-gray-500 group-focus-within:text-red-500'}`} />
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        className={`w-full bg-gray-900/50 border ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-red-500'} rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 ${errors.phone ? 'focus:ring-red-500' : 'focus:ring-red-500'} transition-all shadow-inner`}
                        placeholder="+212 6XX XX XX XX"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1 animate-fade-in-up">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 block text-sm font-semibold ml-1">Message *</label>
                  <div className="relative group">
                    <MessageSquare className={`absolute left-4 top-4 w-5 h-5 transition-colors ${errors.message ? 'text-red-400' : 'text-gray-500 group-focus-within:text-red-500'}`} />
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows="4"
                      className={`w-full bg-gray-900/50 border ${errors.message ? 'border-red-500' : 'border-gray-700 focus:border-red-500'} rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 ${errors.message ? 'focus:ring-red-500' : 'focus:ring-red-500'} transition-all resize-none shadow-inner`}
                      placeholder="Comment pouvons-nous vous aider ?"
                    ></textarea>
                  </div>
                  {errors.message && <p className="text-red-400 text-xs mt-1 ml-1 animate-fade-in-up">{errors.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(239,68,68,0.3)] active:translate-y-0 active:shadow-none flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-10 pl-0 lg:pl-8">
            <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors duration-300">
              <div className="bg-gray-800 p-4 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-white">Téléphone</h3>
                <p className="text-gray-400 text-base leading-relaxed hover:text-white transition-colors cursor-pointer">+212 6 00 00 00 00</p>
                <p className="text-gray-400 text-base leading-relaxed hover:text-white transition-colors cursor-pointer">+212 5 22 22 22 22</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors duration-300">
              <div className="bg-gray-800 p-4 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-white">Email</h3>
                <p className="text-gray-400 text-base leading-relaxed hover:text-white transition-colors cursor-pointer">contact@luxcar.ma</p>
                <p className="text-gray-400 text-base leading-relaxed hover:text-white transition-colors cursor-pointer">reservations@luxcar.ma</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors duration-300">
              <div className="bg-gray-800 p-4 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-white">Adresse</h3>
                <p className="text-gray-400 text-base leading-relaxed">2X4M+JVG, Ain Chqef<br />30050, Maroc</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors duration-300">
              <div className="bg-gray-800 p-4 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-white">Horaires d'ouverture</h3>
                <p className="text-gray-400 text-base leading-relaxed">Lun - Ven: 8h00 - 20h00</p>
                <p className="text-gray-400 text-base leading-relaxed">Sam - Dim: 9h00 - 18h00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps iframe */}
        <div className="mt-20 rounded-2xl overflow-hidden h-[400px] shadow-2xl border border-gray-800 relative group">
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Notre agence</span>
          </div>
          <iframe 
            title="Google Maps Location"
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            src="https://www.google.com/maps?q=2X4M%2BJVG,+Ain+Chqef+30050&output=embed" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
