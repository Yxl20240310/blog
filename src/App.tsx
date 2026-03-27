import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { PrivateRoute, AuthRoute } from './components/PrivateRoute';
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditor from "./pages/AdminEditor";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected User Routes */}
        <Route element={<AuthRoute />}>
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/editor" element={<AdminEditor />} />
          <Route path="/admin/editor/:id" element={<AdminEditor />} />
        </Route>
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