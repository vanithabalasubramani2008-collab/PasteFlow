import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Trash2, ArrowLeft, Terminal } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function CreatePaste() {
  const [content, setContent] = useState('// Initialize new workspace...');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [expiresIn, setExpiresIn] = useState('never');
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      let expirationDate = null;
      if (expiresIn !== 'never') {
        const date = new Date();
        if (expiresIn === '10m') date.setMinutes(date.getMinutes() + 10);
        if (expiresIn === '1h') date.setHours(date.getHours() + 1);
        if (expiresIn === '1d') date.setDate(date.getDate() + 1);
        if (expiresIn === '1w') date.setDate(date.getDate() + 7);
        expirationDate = date.toISOString();
      }

      const res = await api.post('/pastes', {
        title: title || 'untitled_snippet',
        content,
        language,
        visibility,
        expires_at: expirationDate
      });
      
      toast.success("Snippet saved successfully!");
      navigate(`/paste/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save snippet");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-workspace-base overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-14 bg-workspace-surface border-b border-workspace-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-ide-muted hover:text-ide-text flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="w-px h-6 bg-workspace-border mx-2"></div>
          <Link to="/" className="text-lg font-mono font-bold text-ide-text flex items-center gap-2">
            <Terminal size={18} className="text-ide-violet" /> PasteFlow
          </Link>
        </div>
        <div>
          <button className="text-ide-muted hover:text-ide-text text-sm font-mono flex items-center gap-2">
            <Save size={16} /> Save Draft
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-[#111] p-4 flex flex-wrap md:flex-nowrap items-center gap-4 border-b border-workspace-border shrink-0">
        <input 
          type="text" 
          placeholder="Title (untitled)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-workspace-base border border-workspace-border rounded p-2 text-ide-text font-mono text-sm focus:border-ide-violet transition-colors flex-1 min-w-[200px]" 
        />
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-workspace-base border border-workspace-border rounded p-2 text-ide-text font-mono text-sm focus:border-ide-violet transition-colors min-w-[150px]"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
        </select>
        <select 
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="bg-workspace-base border border-workspace-border rounded p-2 text-ide-text font-mono text-sm focus:border-ide-violet transition-colors min-w-[150px]"
        >
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
        <select 
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value)}
          className="bg-workspace-base border border-workspace-border rounded p-2 text-ide-text font-mono text-sm focus:border-ide-violet transition-colors min-w-[150px]"
        >
          <option value="never">Never expire</option>
          <option value="10m">10 Minutes</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
        </select>
      </div>

      {/* Editor Instance - 80% equivalent (flex-1) */}
      <div className="flex-1 min-h-0 bg-[#0d0d0d]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={content}
          onChange={(val) => setContent(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            scrollBeyondLastLine: false,
            padding: { top: 24, bottom: 24 },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Bottom Actions */}
      <div className="h-16 bg-workspace-surface border-t border-workspace-border flex items-center justify-end px-6 gap-4 shrink-0">
        <button 
          onClick={() => setContent('')}
          className="px-6 py-2 rounded font-mono text-ide-muted hover:text-ide-text hover:bg-workspace-base transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} /> Clear
        </button>
        <button 
          onClick={handleCreate}
          disabled={isSaving}
          className={`px-8 py-2 rounded font-bold font-mono transition-all flex items-center gap-2 ${
            isSaving 
              ? 'bg-workspace-elevated text-ide-muted cursor-not-allowed' 
              : 'bg-ide-violet text-white hover:bg-ide-violet/90 glow-violet'
          }`}
        >
          <Save size={18} />
          {isSaving ? 'Creating...' : 'Create Paste'}
        </button>
      </div>

    </div>
  );
}
