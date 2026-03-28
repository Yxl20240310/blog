import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-white/10 mt-auto py-6 text-center text-gray-500 font-mono text-xs">
        <p>© 2026 NEXUS_BLOG. ALL RIGHTS RESERVED.</p>
        <p>POWERED BY NEURAL NETWORK & REACT.</p>
      </footer>
    </div>
  );
}
