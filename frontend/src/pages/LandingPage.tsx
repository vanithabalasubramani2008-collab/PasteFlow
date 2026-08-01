import { Link } from 'react-router-dom';
import { Zap, Shield, HardDrive } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 z-10">
        
        {/* Left: Hero Section */}
        <div className="flex-1 flex flex-col gap-6 text-left">
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-ide-text leading-tight">
            Create and share code snippets instantly.
          </h1>
          <div className="text-xl font-mono text-ide-muted space-y-2 mb-4">
            <p>Simple.</p>
            <p>Fast.</p>
            <p>Secure.</p>
          </div>
          
          <div>
            <Link 
              to="/create" 
              className="inline-block bg-ide-violet text-white font-bold font-mono text-lg px-8 py-4 rounded shadow-[4px_4px_0_0_rgba(16,185,129,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(16,185,129,1)] transition-all border-2 border-ide-emerald"
            >
              [ Create Paste ]
            </Link>
          </div>
        </div>

        {/* Right: Beautiful Code Preview */}
        <div className="flex-1 w-full max-w-lg shadow-[8px_8px_0_0_rgba(139,92,246,0.3)] rounded-lg overflow-hidden border border-workspace-border bg-workspace-surface transform rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border-b border-workspace-border">
            <div className="w-3 h-3 rounded-full bg-ide-amber"></div>
            <div className="w-3 h-3 rounded-full bg-ide-emerald"></div>
            <div className="w-3 h-3 rounded-full bg-ide-violet"></div>
            <span className="ml-2 text-xs font-mono text-ide-muted">hello_world.js</span>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto text-ide-text bg-workspace-surface">
            <pre>
<span className="text-ide-violet">const</span> <span className="text-ide-emerald">PasteFlow</span> = <span className="text-ide-violet">async</span> () {`=>`} {'{\n'}
  <span className="text-ide-violet">const</span> snippet = <span className="text-ide-violet">await</span> db.pastes.<span className="text-ide-amber">create</span>({`{\n`}
    title: <span className="text-ide-emerald">"hello_world"</span>,
    language: <span className="text-ide-emerald">"javascript"</span>,
    content: <span className="text-ide-emerald">"console.log('Hello');"</span>
  {`}`});
  
  <span className="text-ide-violet">return</span> snippet.url;
{'}'};
            </pre>
          </div>
        </div>

      </div>

      {/* Bottom: Features */}
      <div className="max-w-6xl w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 z-10 pb-12">
        <div className="bg-workspace-surface border border-workspace-border p-6 rounded shadow-[4px_4px_0_0_rgba(255,255,255,0.05)] flex items-center gap-4">
          <div className="bg-ide-amber/20 p-3 rounded-full">
            <Zap className="text-ide-amber" size={24} />
          </div>
          <h3 className="font-bold text-lg font-mono">Instant Sharing</h3>
        </div>
        
        <div className="bg-workspace-surface border border-workspace-border p-6 rounded shadow-[4px_4px_0_0_rgba(255,255,255,0.05)] flex items-center gap-4">
          <div className="bg-ide-emerald/20 p-3 rounded-full">
            <Shield className="text-ide-emerald" size={24} />
          </div>
          <h3 className="font-bold text-lg font-mono">Secure Pastes</h3>
        </div>

        <div className="bg-workspace-surface border border-workspace-border p-6 rounded shadow-[4px_4px_0_0_rgba(255,255,255,0.05)] flex items-center gap-4">
          <div className="bg-ide-violet/20 p-3 rounded-full">
            <HardDrive className="text-ide-violet" size={24} />
          </div>
          <h3 className="font-bold text-lg font-mono">Permanent Storage</h3>
        </div>
      </div>
    </div>
  );
}
