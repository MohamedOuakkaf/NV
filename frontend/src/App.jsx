import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FleetSection from './components/FleetSection';
import DestinationsSection from './components/DestinationsSection';
import StatsSection from './components/StatsSection';
import ServicesSection from './components/ServicesSection';
import ReviewsSection from './components/ReviewsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ReservationModal from './components/ReservationModal';
import ReservationPage from './components/ReservationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import MyReservationsPage from './pages/MyReservationsPage';

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState('home'); // home | login | register | admin | my-reservations | reservation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarName, setSelectedCarName] = useState('');
  const [searchData, setSearchData] = useState(null);

  // Sync view with user role on login/logout
  useEffect(() => {
    if (user?.role === 'admin' && view !== 'admin' && view !== 'home') {
      setView('admin');
    }
  }, [user, view]);

  const handleOpenModal = (carName = '') => {
    setSelectedCarName(carName);
    setIsModalOpen(true);
  };

  const handleReserveClick = (carId) => {
    setSearchData({
      carId,
      city: 'Casablanca',
      pickupDate: '',
      returnDate: ''
    });
    setView('reservation');
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = (data) => {
    setSearchData(data);
    setView('reservation');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (newView) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  // ─── Routing Logic ──────────────────────────────────────────────────────────
  
  // 1. Admin Dashboard (Full Screen)
  if (view === 'admin' && user?.role === 'admin') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  // 2. Auth Pages (Full Screen)
  if (view === 'login') return <LoginPage onNavigate={handleNavigate} />;
  if (view === 'register') return <RegisterPage onNavigate={handleNavigate} />;

  // 3. My Reservations (With Nav)
  if (view === 'my-reservations') {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Navigation onNavigate={handleNavigate} />
        <MyReservationsPage onNavigate={handleNavigate} />
        <WhatsAppButton />
      </div>
    );
  }

  // 4. Reservation Step (With Nav)
  if (view === 'reservation') {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Navigation onNavigate={handleNavigate} />
        <ReservationPage 
          searchData={searchData} 
          onBack={() => setView('home')} 
          onNavigate={handleNavigate} 
        />
        <WhatsAppButton />
      </div>
    );
  }

  // 5. Default: Home Page
  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      <Navigation onOpenModal={handleOpenModal} onNavigate={handleNavigate} />
      
      <main>
        <HeroSection onSearchSubmit={handleSearchSubmit} />
        <FleetSection onReserve={handleReserveClick} />
        <DestinationsSection />
        <StatsSection />
        <ServicesSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppButton />
      
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        carName={selectedCarName} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
