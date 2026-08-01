import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-workspace-surface border border-workspace-border p-12 rounded-lg text-center max-w-lg w-full shadow-float relative overflow-hidden">
        
        {/* Terminal Header Decorator */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-workspace-base border-b border-workspace-border flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>

        <Terminal size={64} className="text-ide-amber mx-auto mb-6 mt-8" />
        
        <h1 className="text-8xl font-black text-ide-text mb-4 font-mono tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-ide-muted mb-6 font-mono">Module Not Found</h2>
        
        <div className="bg-workspace-base p-4 rounded text-left border border-workspace-border font-mono text-sm text-ide-emerald mb-8">
          <p><span className="text-ide-violet">Error</span>: Cannot resolve path <span className="text-ide-amber">'{window.location.pathname}'</span></p>
          <p className="mt-2 text-ide-muted">// Check your import paths and try again.</p>
        </div>

        <Link to="/" className="inline-block bg-ide-violet text-white px-8 py-3 rounded font-bold hover:bg-ide-violet/90 transition-all shadow-btn">
          Return to root
        </Link>
      </div>
    </div>
  );
}
