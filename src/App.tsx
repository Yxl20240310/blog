import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background relative selection:bg-cyan-500/30 selection:text-cyan-100">
        <Navbar />
        <main className="container mx-auto px-4 max-w-5xl">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}