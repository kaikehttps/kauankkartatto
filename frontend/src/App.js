import React, { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AdminPanel from "./components/AdminPanel";

// Lazy load heavy components
const About = lazy(() => import("./components/About"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const MapSection = lazy(() => import("./components/MapSection"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <About />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <ContactForm />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <MapSection />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
      <Toaster position="top-right" />
      <AdminPanel isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </div>
  );
}

export default App;
