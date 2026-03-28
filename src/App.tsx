import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ArticleEditor from "@/pages/admin/Editor";
import { useAppStore } from "@/lib/store";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/editor" 
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/editor/:id" 
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={
            <div className="text-center py-20 text-neon-cyan font-mono text-2xl text-glow">
              404 - SECTOR_NOT_FOUND
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
