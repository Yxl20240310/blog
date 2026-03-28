import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';

function App() {
  return (
    <Router>
      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<ArticleDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="editor" element={<Editor />} />
          <Route path="editor/:id" element={<Editor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
