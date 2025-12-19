
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import MapScreen from './components/MapScreen';
import DetailsScreen from './components/DetailsScreen';
import UploadScreen from './components/UploadScreen';
import DashboardScreen from './components/DashboardScreen';
import RentalsScreen from './components/RentalsScreen';
import VerificationScreen from './components/VerificationScreen';
import BookingScreen from './components/BookingScreen';
import ActiveRentalScreen from './components/ActiveRentalScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import OwnerRequestScreen from './components/OwnerRequestScreen';
import FavoritesScreen from './components/FavoritesScreen';
import NotificationsScreen from './components/NotificationsScreen';
import SettingsScreen from './components/SettingsScreen';
import HelpScreen from './components/HelpScreen';
import EditProfileScreen from './components/EditProfileScreen';
import ChangePasswordScreen from './components/ChangePasswordScreen';
import ServiceProfileScreen from './components/ServiceProfileScreen';
import QrCodeScreen from './components/QrCodeScreen';
import CirclesScreen from './components/CirclesScreen';
import WalletScreen from './components/WalletScreen';
import { UserProvider } from './context/UserContext';

const AppContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full max-w-[480px] h-full sm:h-[850px] bg-white dark:bg-[#101c22] sm:my-8 sm:rounded-[2rem] sm:border-[8px] sm:border-[#111827] relative shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AppContainer>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/details" element={<DetailsScreen />} />
            <Route path="/booking" element={<BookingScreen />} />
            <Route path="/upload" element={<UploadScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/rentals" element={<RentalsScreen />} />
            <Route path="/verify" element={<VerificationScreen />} />
            <Route path="/rental" element={<ActiveRentalScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/owner-request" element={<OwnerRequestScreen />} />
            <Route path="/favorites" element={<FavoritesScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/settings/edit-profile" element={<EditProfileScreen />} />
            <Route path="/settings/change-password" element={<ChangePasswordScreen />} />
            <Route path="/settings/service-profile" element={<ServiceProfileScreen />} />
            <Route path="/help" element={<HelpScreen />} />
            <Route path="/qr-pass" element={<QrCodeScreen />} />
            <Route path="/circles" element={<CirclesScreen />} />
            <Route path="/wallet" element={<WalletScreen />} />
          </Routes>
        </AppContainer>
      </HashRouter>
    </UserProvider>
  );
};

export default App;
