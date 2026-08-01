import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import QRCode from 'react-qr-code';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';
import { Copy, Download, QrCode, FileText, Eye, Lock, Loader2, ArrowLeft, Terminal } from 'lucide-react';
import api from '../lib/api';

export default function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [views, setViews] = useState(0);
  const [title, setTitle] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPaste = async (providedPassword = '') => {
    try {
      setLoading(true);
      const url = providedPassword ? `/pastes/${id}?password=${encodeURIComponent(providedPassword)}` : `/pastes/${id}`;
      const res = await api.get(url);
      
      if (res.data.content === 'PASSWORD_PROTECTED') {
        setIsProtected(true);
      } else {
        setContent(res.data.content);
        setLanguage(res.data.language);
        setViews(res.data.views);
        setTitle(res.data.title);
        setIsProtected(false);
      }
    } catch (err: any) {
      toast.error('Paste not found or access denied');
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaste();
  }, [id]);

  const handleUnlock = () => {
    fetchPaste(password);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!', { style: { background: '#1A1A1A', color: '#10B981', border: '1px solid #333333' }});
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `paste_${id}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    toast.success('File downloaded!', { style: { background: '#1A1A1A', color: '#10B981', border: '1px solid #333333' }});
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-ide-violet" size={32} />
      </div>
    );
  }

  if (isProtected) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-workspace-surface border border-workspace-border p-8 rounded-lg text-center max-w-sm w-full shadow-float">
          <Lock size={48} className="text-ide-amber mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4 text-ide-text">Password Protected</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Enter password" 
            className="w-full bg-workspace-base border border-workspace-border rounded p-2 mb-4 text-ide-text font-mono focus:border-ide-violet transition-colors" 
          />
          <button onClick={handleUnlock} className="w-full bg-ide-violet text-white py-2 rounded font-bold hover:bg-ide-violet/90 glow-violet transition-all">Unlock</button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          {language === 'markdown' && (
            <button onClick={() => setPreviewMode(!previewMode)} className={`px-3 py-1.5 rounded font-mono text-sm transition-colors ${previewMode ? 'bg-ide-violet text-white' : 'bg-workspace-base border border-workspace-border text-ide-muted hover:text-ide-text'}`}>
              <FileText size={14} className="inline mr-2" /> {previewMode ? 'Code' : 'Preview'}
            </button>
          )}
          <button onClick={() => setShowQR(!showQR)} className="px-3 py-1.5 rounded bg-workspace-base border border-workspace-border text-ide-muted hover:text-ide-text hover:border-ide-violet transition-colors relative font-mono text-sm">
            <QrCode size={14} className="inline mr-2" /> Share
            {showQR && (
              <div className="absolute top-10 right-0 p-4 bg-white rounded shadow-float z-50">
                <QRCode value={window.location.href} size={128} />
              </div>
            )}
          </button>
          <button onClick={handleDownload} className="px-3 py-1.5 rounded bg-workspace-base border border-workspace-border text-ide-muted hover:text-ide-text hover:border-ide-emerald transition-colors font-mono text-sm">
            <Download size={14} className="inline mr-2" /> Raw
          </button>
          <button onClick={handleCopy} className="px-3 py-1.5 rounded bg-ide-violet/20 border border-ide-violet text-ide-violet hover:bg-ide-violet hover:text-white transition-colors flex items-center gap-2 font-mono text-sm font-bold">
            <Copy size={14} /> Copy
          </button>
        </div>
      </div>

      {/* Paste Info Header */}
      <div className="bg-[#111] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-workspace-border shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ide-text font-mono mb-1">{title || 'untitled_snippet'}</h2>
          <div className="flex items-center gap-4 text-xs font-mono text-ide-muted">
            <span className="bg-ide-emerald/10 text-ide-emerald px-2 py-0.5 rounded border border-ide-emerald/30">{language}</span>
            <span className="flex items-center gap-1"><Eye size={12}/> {views} views</span>
            {isProtected && <span className="flex items-center gap-1 text-ide-amber"><Lock size={12}/> Protected</span>}
          </div>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 min-h-0 bg-[#0d0d0d]">
        {previewMode ? (
          <div className="p-8 h-full overflow-y-auto prose prose-invert max-w-none font-sans mx-auto">
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={content}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollBeyondLastLine: false,
              padding: { top: 24, bottom: 24 }
            }}
          />
        )}
      </div>

      {/* Bottom Metadata */}
      <div className="h-10 bg-workspace-surface border-t border-workspace-border flex items-center px-6 text-xs font-mono text-ide-muted shrink-0">
        <span>Paste ID: {id}</span>
      </div>
    </div>
  );
}
