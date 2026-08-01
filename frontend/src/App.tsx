import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User, Terminal, Github, Loader2 } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import CommandPalette from './components/CommandPalette';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import DashboardPage from './pages/Dashboard';

const CreatePaste = lazy(() => import('./pages/CreatePaste'));
const ViewPastePage = lazy(() => import('./pages/ViewPaste'));

const FallbackLoader = () => (
  <div className="h-full flex items-center justify-center">
    <Loader2 className="animate-spin text-ide-violet" size={32} />
  </div>
);

const queryClient = new QueryClient();

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="h-16 bg-workspace-surface border-b border-workspace-border flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-mono font-bold text-ide-text flex items-center gap-2">
          <Terminal size={24} className="text-ide-violet" />
          PasteFlow
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-mono">
          <Link to="/search" className="text-ide-muted hover:text-ide-text transition-colors">Explore</Link>
          <Link to="/create" className="text-ide-muted hover:text-ide-text transition-colors">Create</Link>
          {user && <Link to="/dashboard" className="text-ide-muted hover:text-ide-text transition-colors">Dashboard</Link>}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm font-mono">
        {user ? (
          <Link to="/profile" className="text-ide-text hover:text-ide-violet transition-colors flex items-center gap-2">
            <User size={16} /> Profile
          </Link>
        ) : (
          <Link to="/auth" className="text-ide-text hover:text-ide-violet transition-colors flex items-center gap-2">
            <User size={16} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="h-12 bg-workspace-surface border-t border-workspace-border flex items-center justify-center gap-6 text-xs font-mono text-ide-muted z-30">
    <span className="text-ide-text font-bold">PasteFlow</span>
    <Link to="#" className="hover:text-ide-violet transition-colors">Privacy</Link>
    <Link to="#" className="hover:text-ide-violet transition-colors">API</Link>
    <a href="#" className="hover:text-ide-violet transition-colors flex items-center gap-1">
      <Github size={12} /> GitHub
    </a>
  </footer>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex flex-col bg-workspace-base text-ide-text font-sans overflow-hidden">
      <Navbar />
      <main className="flex-1 relative overflow-y-auto bg-workspace-base">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1A1A1A', color: '#10B981', border: '1px solid #333333' }}} />
            <CommandPalette />
            <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create" element={<Suspense fallback={<FallbackLoader />}><CreatePaste /></Suspense>} />
              <Route path="/paste/:id" element={<Suspense fallback={<FallbackLoader />}><ViewPastePage /></Suspense>} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
