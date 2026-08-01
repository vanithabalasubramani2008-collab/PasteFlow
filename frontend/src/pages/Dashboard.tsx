import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Lock, Globe, Eye, Trash2, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [pastes, setPastes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    api.get('/pastes/my')
      .then(res => {
        if (Array.isArray(res.data)) setPastes(res.data);
        else setPastes([]);
      })
      .catch(() => toast.error('Failed to load workspace'))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    try {
      await api.delete(`/pastes/${id}`);
      setPastes(prev => prev.filter(p => p.id !== id));
      toast.success('Snippet deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-ide-violet" size={32} />
      </div>
    );
  }

  const totalPastes = pastes.length;
  const totalViews = pastes.reduce((acc, p) => acc + (p.views || 0), 0);
  const publicPastes = pastes.filter(p => p.visibility === 'public').length;
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 h-full flex flex-col overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ide-text mb-2 font-mono">My Workspace</h1>
          <p className="text-ide-muted font-mono text-sm">Manage and organize your snippets</p>
        </div>
        <Link to="/create" className="bg-ide-violet text-white px-6 py-2.5 rounded font-bold hover:bg-ide-violet/90 glow-violet transition-all font-mono text-sm flex items-center gap-2">
          + New Snippet
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-workspace-surface border border-workspace-border p-4 rounded-lg shadow-panel">
              <div className="text-ide-muted text-xs font-mono mb-2 flex items-center gap-2 uppercase"><FileText size={14}/> Total Pastes</div>
              <div className="text-2xl font-bold text-ide-text font-mono">{totalPastes}</div>
            </div>
            <div className="bg-workspace-surface border border-workspace-border p-4 rounded-lg shadow-panel">
              <div className="text-ide-muted text-xs font-mono mb-2 flex items-center gap-2 uppercase"><Eye size={14}/> Total Views</div>
              <div className="text-2xl font-bold text-ide-amber font-mono">{totalViews}</div>
            </div>
            <div className="bg-workspace-surface border border-workspace-border p-4 rounded-lg shadow-panel">
              <div className="text-ide-muted text-xs font-mono mb-2 flex items-center gap-2 uppercase"><Globe size={14}/> Public</div>
              <div className="text-2xl font-bold text-ide-emerald font-mono">{publicPastes}</div>
            </div>
            <div className="bg-workspace-surface border border-workspace-border p-4 rounded-lg shadow-panel">
              <div className="text-ide-muted text-xs font-mono mb-2 flex items-center gap-2 uppercase"><Lock size={14}/> Private</div>
              <div className="text-2xl font-bold text-ide-violet font-mono">{totalPastes - publicPastes}</div>
            </div>
          </div>

          {/* Recent Pastes Table */}
          <div className="bg-workspace-surface border border-workspace-border rounded-lg shadow-panel flex-1 flex flex-col min-h-[400px]">
            <div className="px-6 py-4 border-b border-workspace-border">
              <h2 className="text-lg font-bold text-ide-text font-mono">Recent Snippets</h2>
            </div>
            
            {pastes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-ide-muted p-12 bg-workspace-base/30 rounded-b-lg border-t border-workspace-border/50">
                <div className="w-16 h-16 bg-workspace-base border border-workspace-border rounded-full flex items-center justify-center mb-6 shadow-panel">
                  <FileText size={32} className="text-ide-violet/70" />
                </div>
                <h3 className="text-xl font-bold text-ide-text mb-2 font-mono">No snippets found</h3>
                <p className="mb-6 max-w-sm text-center text-sm font-mono leading-relaxed">Your workspace is looking a bit empty. Create your first paste to start organizing your code snippets.</p>
                <Link to="/create" className="bg-ide-violet text-white px-6 py-2.5 rounded font-bold hover:bg-ide-violet/90 glow-violet transition-all font-mono text-sm flex items-center gap-2">
                  <FileText size={16} /> Create New Snippet
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-workspace-border bg-workspace-base/50">
                      <th className="px-6 py-4 font-mono text-xs text-ide-muted uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 font-mono text-xs text-ide-muted uppercase tracking-wider">Language</th>
                      <th className="px-6 py-4 font-mono text-xs text-ide-muted uppercase tracking-wider">Visibility</th>
                      <th className="px-6 py-4 font-mono text-xs text-ide-muted uppercase tracking-wider text-right">Stats</th>
                      <th className="px-6 py-4 font-mono text-xs text-ide-muted uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastes.map((paste) => (
                      <tr key={paste.id} className="border-b border-workspace-border hover:bg-workspace-base/30 transition-colors group">
                        <td className="px-6 py-4">
                          <Link to={`/paste/${paste.id}`} className="font-bold text-ide-text hover:text-ide-amber font-mono text-[15px] truncate max-w-[200px] block">
                            {paste.title}
                          </Link>
                          <div className="text-xs text-ide-muted mt-1 font-mono">{new Date(paste.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-workspace-base border border-workspace-border px-2.5 py-1 rounded text-xs font-mono text-ide-emerald">
                            {paste.language}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-mono text-ide-muted">
                            {paste.visibility === 'private' && <Lock size={12} className="text-ide-amber" />}
                            {paste.visibility === 'public' && <Globe size={12} className="text-ide-emerald" />}
                            {paste.visibility === 'unlisted' && <Eye size={12} className="text-ide-violet" />}
                            <span className="capitalize">{paste.visibility}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-mono text-ide-muted">
                          {paste.views} views
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(paste.id)} className="text-ide-muted hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Side Quick Actions */}
        <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">
          <div className="bg-workspace-surface border border-workspace-border p-6 rounded-lg shadow-panel">
            <h3 className="text-sm font-bold text-ide-text font-mono uppercase tracking-wider mb-4 border-b border-workspace-border pb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="text-sm font-mono text-ide-muted hover:text-ide-violet transition-colors flex items-center justify-between p-2 rounded hover:bg-workspace-base">
                Edit Profile <span>→</span>
              </Link>
              <Link to="/search" className="text-sm font-mono text-ide-muted hover:text-ide-emerald transition-colors flex items-center justify-between p-2 rounded hover:bg-workspace-base">
                Search Explore <span>→</span>
              </Link>
              <button className="text-sm font-mono text-ide-muted hover:text-ide-amber transition-colors flex items-center justify-between p-2 rounded hover:bg-workspace-base w-full">
                API Tokens <span>→</span>
              </button>
            </div>
          </div>
          
          <div className="bg-workspace-surface border border-workspace-border p-6 rounded-lg shadow-panel">
            <h3 className="text-sm font-bold text-ide-text font-mono uppercase tracking-wider mb-4 border-b border-workspace-border pb-2">Storage</h3>
            <div className="flex flex-col gap-2 text-sm font-mono text-ide-muted">
              <div className="flex justify-between items-center">
                <span>Used</span>
                <span className="text-ide-text">{(totalPastes * 2.4).toFixed(1)} KB</span>
              </div>
              <div className="w-full bg-workspace-base rounded h-1.5 mt-1 overflow-hidden">
                <div className="bg-ide-violet h-full" style={{ width: `${Math.min(100, totalPastes * 2.4)}%` }}></div>
              </div>
              <div className="text-[10px] mt-1">Free tier: 10 MB limit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
