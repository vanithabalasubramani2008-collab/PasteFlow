import { User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pastes, setPastes] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      api.get('/pastes/my')
        .then(res => setPastes(res.data))
        .catch(console.error)
        .finally(() => setStatsLoading(false));
    }
  }, [user, isLoading, navigate]);

  if (!user) return null;

  const totalViews = pastes.reduce((sum, p) => sum + (p.views || 0), 0);
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-workspace-base overflow-y-auto">
      
      <div className="w-full max-w-md bg-workspace-surface border border-workspace-border p-8 rounded-lg shadow-float text-center relative overflow-hidden">
        
        {/* Background accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-ide-violet/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-24 h-24 bg-workspace-base rounded-full border-2 border-ide-violet mx-auto flex items-center justify-center mb-6 relative z-10 shadow-[4px_4px_0_0_rgba(139,92,246,0.3)]">
          <User size={40} className="text-ide-text" />
        </div>
        
        <h1 className="text-2xl font-bold font-mono text-ide-text mb-1">
          {user.email.split('@')[0]}
        </h1>
        <p className="text-ide-muted font-mono text-sm mb-8 flex items-center justify-center gap-2">
          <Mail size={14} /> {user.email}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          <div className="bg-workspace-base border border-workspace-border p-4 rounded text-center">
            <div className="text-3xl font-black font-mono text-ide-text mb-1">{statsLoading ? '-' : pastes.length}</div>
            <div className="text-xs uppercase tracking-wider text-ide-muted font-mono">Pastes</div>
          </div>
          <div className="bg-workspace-base border border-workspace-border p-4 rounded text-center">
            <div className="text-3xl font-black font-mono text-ide-emerald mb-1">{statsLoading ? '-' : totalViews}</div>
            <div className="text-xs uppercase tracking-wider text-ide-muted font-mono">Views</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full py-2.5 bg-workspace-base border border-workspace-border text-ide-text text-sm font-mono hover:border-ide-muted transition-colors rounded">
            Manage Subscription
          </button>
          <button className="w-full py-2.5 bg-workspace-base border border-workspace-border text-ide-text text-sm font-mono hover:border-ide-muted transition-colors rounded">
            API Settings
          </button>
          <button 
            onClick={logout} 
            className="w-full py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono hover:bg-red-500/20 hover:border-red-500/50 transition-colors rounded mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
