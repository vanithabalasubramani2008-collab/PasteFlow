import { useState } from 'react';
import { Terminal, KeyRound, User } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email); // FastAPI OAuth2 expects 'username' field
        formData.append('password', password);
        
        const res = await api.post('/auth/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        login(res.data.access_token, { email, id: 0 }); // We fetch me on mount usually
        toast.success('Authentication successful');
        navigate('/dashboard');
      } else {
        await api.post('/auth/register', { name: name || 'User', email, password });
        toast.success('Account created successfully! Please login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google', { token: tokenResponse.access_token });
        login(res.data.access_token, { email: "google_user", id: 0 }); // Fetch me correctly on reload
        toast.success('Google Authentication successful');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.detail || 'Google Auth failed');
      }
    },
    onError: () => toast.error('Google Sign-In failed')
  });

  const handleGoogleLogin = () => {
    if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      loginWithGoogle();
    } else {
      toast.error('Google Client ID not configured (VITE_GOOGLE_CLIENT_ID)');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-workspace-base overflow-y-auto">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-mono font-bold text-ide-text flex items-center justify-center gap-3">
          <Terminal size={32} className="text-ide-violet" />
          Welcome to PasteFlow
        </h1>
        <p className="text-ide-muted mt-2 font-mono text-sm">
          {isLogin ? 'Log in to manage your snippets' : 'Create an account to manage your snippets'}
        </p>
      </div>

      <div className="w-full max-w-md bg-workspace-surface border border-workspace-border p-8 rounded-lg shadow-[8px_8px_0_0_rgba(139,92,246,0.2)]">
        
        {/* OAuth Placeholders */}
        <div className="flex flex-col gap-3 mb-8">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-workspace-base border border-workspace-border hover:border-ide-muted rounded transition-colors text-sm font-mono text-ide-text"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-workspace-border flex-1"></div>
          <span className="text-xs font-mono text-ide-muted uppercase">or</span>
          <div className="h-px bg-workspace-border flex-1"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono text-ide-muted mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-muted" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-workspace-base border border-workspace-border rounded py-2.5 pl-9 pr-3 text-ide-text placeholder-ide-muted focus:border-ide-violet transition-all text-sm font-mono"
                  placeholder="vanitha"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono text-ide-muted mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-muted font-mono">@</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-workspace-base border border-workspace-border rounded py-2.5 pl-9 pr-3 text-ide-text placeholder-ide-muted focus:border-ide-violet transition-all text-sm font-mono"
                placeholder="admin@pasteflow.local"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ide-muted mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-muted" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-workspace-base border border-workspace-border rounded py-2.5 pl-9 pr-3 text-ide-text placeholder-ide-muted focus:border-ide-violet transition-all text-sm font-mono tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-2.5 bg-ide-violet text-white text-sm font-bold font-mono rounded hover:bg-ide-violet/90 glow-violet transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-workspace-border pt-6">
          <p className="text-sm font-mono text-ide-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleMode} className="ml-2 text-ide-violet hover:underline focus:outline-none">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
