import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, FileJson, Clock, User, Filter, Loader2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [pastes, setPastes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pastes/')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPastes(res.data);
        } else {
          console.error("API did not return an array:", res.data);
          setPastes([]);
        }
      })
      .catch(() => {
        toast.error('Failed to load explorer data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredPastes = pastes.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.language.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
      
      {/* Top Search / Filter Panel */}
      <div className="bg-workspace-surface border border-workspace-border rounded-lg p-4 shadow-panel flex-shrink-0">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-muted" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workspaces (Cmd+Shift+F)..." 
              className="w-full bg-workspace-base border border-workspace-border rounded py-2.5 pl-10 pr-4 text-ide-text placeholder-ide-muted focus:border-ide-violet transition-colors font-mono text-sm"
            />
          </div>
          <button type="button" className="p-2.5 bg-workspace-base border border-workspace-border rounded text-ide-muted hover:text-ide-text hover:border-ide-muted transition-colors">
            <Filter size={18} />
          </button>
          <button 
            type="submit"
            className="px-6 py-2.5 bg-ide-violet text-white rounded font-bold hover:bg-ide-violet/90 glow-violet transition-all whitespace-nowrap text-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Explorer Results */}
      <div className="flex-1 overflow-y-auto pb-8">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-ide-violet" size={32} />
          </div>
        ) : filteredPastes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-ide-muted p-16 mt-8 bg-workspace-surface border border-workspace-border rounded-lg shadow-panel max-w-2xl mx-auto">
            <SearchIcon size={48} className="mb-6 text-ide-muted/50" />
            <h3 className="text-xl font-bold text-ide-text mb-2 font-mono">No results found</h3>
            <p className="text-sm font-mono text-center max-w-md">We couldn't find any public snippets matching '{query}'. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPastes.map((paste) => (
              <Link to={`/paste/${paste.id}`} key={paste.id} className="bg-workspace-surface border border-workspace-border rounded-lg p-5 shadow-panel hover:border-ide-violet transition-colors group flex flex-col h-40">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileJson size={20} className={paste.language === 'javascript' ? "text-ide-amber" : "text-ide-emerald"} />
                    <h3 className="font-bold text-ide-text text-lg truncate group-hover:text-ide-violet transition-colors">
                      {paste.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-ide-muted bg-workspace-base px-2 py-1 rounded">
                    {paste.language}
                  </span>
                </div>
                
                <div className="mt-auto flex items-center justify-between text-xs font-mono text-ide-muted pt-4 border-t border-workspace-border/50">
                  <div className="flex items-center gap-2">
                    <User size={14} /> user_{paste.owner_id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {new Date(paste.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
