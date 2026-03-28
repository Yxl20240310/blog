import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ArticleEditor from "@/pages/admin/Editor";
import { useAppStore } from "@/lib/store";

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = useAppStore(state => state.isAdminAuthenticated);
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

// Protected Route Component for User
const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAppStore(state => state.currentUser);
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Protected Routes */}
          <Route 
            path="/article/:id" 
            element={
              <UserProtectedRoute>
                <ArticleDetail />
              </UserProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/editor" 
            element={
              <AdminProtectedRoute>
                <ArticleEditor />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/editor/:id" 
            element={
              <AdminProtectedRoute>
                <ArticleEditor />
              </AdminProtectedRoute>
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
