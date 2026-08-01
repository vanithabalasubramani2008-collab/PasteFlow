import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileCode2, User, Settings, Terminal, Home } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { id: 'home', label: 'Go to Explorer', icon: Home, route: '/' },
    { id: 'create', label: 'Create New Paste', icon: FileCode2, route: '/create' },
    { id: 'search', label: 'Search Pastes', icon: Search, route: '/search' },
    { id: 'dashboard', label: 'My Workspace', icon: Terminal, route: '/dashboard' },
    { id: 'profile', label: 'User Profile', icon: User, route: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleAction = (route: string) => {
    navigate(route);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-lg bg-workspace-surface border border-workspace-border rounded-lg shadow-float overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-workspace-border">
          <Search size={18} className="text-ide-muted mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-ide-text font-mono text-sm placeholder:text-ide-muted"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-1">
            <kbd className="bg-workspace-base border border-workspace-border rounded px-1.5 py-0.5 text-[10px] text-ide-muted font-mono">ESC</kbd>
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-sm text-ide-muted font-mono">No commands found.</div>
          ) : (
            filteredActions.map((action, idx) => (
              <button 
                key={action.id}
                onClick={() => handleAction(action.route)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${idx === 0 && query ? 'bg-ide-violet text-white' : 'text-ide-text hover:bg-workspace-base hover:text-ide-violet'}`}
              >
                <action.icon size={16} className={idx === 0 && query ? 'text-white' : 'text-ide-muted'} />
                <span className="font-mono text-sm">{action.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
