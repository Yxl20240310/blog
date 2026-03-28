import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
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
