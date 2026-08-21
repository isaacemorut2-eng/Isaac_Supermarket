import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { TopBanner } from './components/TopBanner';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ValueProps } from './components/ValueProps';
import { ProductGrid } from './components/ProductGrid';
import { InventoryTrackerModal } from './components/InventoryTrackerModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { QuickViewModal } from './components/QuickViewModal';
import { MobileDevicePreview } from './components/MobileDevicePreview';
import { LiveToastAlerts } from './components/LiveToastAlerts';
import { Footer } from './components/Footer';

export function AppContent() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-600 selection:text-white">
      {/* Top Marketing Promo Banner */}
      <TopBanner />

      {/* Main Header */}
      <Header />

      {/* Primary Navigation & Categories Menu */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Slider & Promotions Section */}
        <HeroSlider />

        {/* Value Proposition Trust Badges */}
        <ValueProps />

        {/* Product Catalog Grid with Interactive Tabs & Filters */}
        <ProductGrid />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <CartDrawer />
      <PaymentGatewayModal />
      <OrderSuccessModal />
      <QuickViewModal />
      <InventoryTrackerModal />
      <MobileDevicePreview />
      <LiveToastAlerts />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
