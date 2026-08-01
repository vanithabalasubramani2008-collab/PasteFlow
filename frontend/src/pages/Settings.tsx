import { Settings as SettingsIcon, Shield, Bell, Palette, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-bold text-ide-text mb-6 font-mono flex items-center gap-2">
          <SettingsIcon size={24} className="text-ide-muted" /> Settings
        </h1>
        <nav className="space-y-1">
          <button className="w-full text-left px-4 py-3 rounded bg-ide-violet/10 text-ide-violet font-bold border-l-4 border-ide-violet">
            <Shield size={18} className="inline mr-2" /> Account
          </button>
          <button className="w-full text-left px-4 py-3 rounded text-ide-muted hover:bg-workspace-surface hover:text-ide-text transition-colors">
            <Key size={18} className="inline mr-2" /> API Keys
          </button>
          <button className="w-full text-left px-4 py-3 rounded text-ide-muted hover:bg-workspace-surface hover:text-ide-text transition-colors">
            <Palette size={18} className="inline mr-2" /> Preferences
          </button>
          <button className="w-full text-left px-4 py-3 rounded text-ide-muted hover:bg-workspace-surface hover:text-ide-text transition-colors">
            <Bell size={18} className="inline mr-2" /> Notifications
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-workspace-surface border border-workspace-border rounded-lg shadow-panel p-6">
          <h2 className="text-xl font-bold text-ide-text mb-6 border-b border-workspace-border pb-4">Account Security</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-ide-muted uppercase tracking-wider mb-2">Change Password</label>
              <div className="space-y-3">
                <input type="password" placeholder="Current Password" className="w-full bg-workspace-base border border-workspace-border rounded p-3 text-ide-text focus:outline-none focus:border-ide-violet" />
                <input type="password" placeholder="New Password" className="w-full bg-workspace-base border border-workspace-border rounded p-3 text-ide-text focus:outline-none focus:border-ide-violet" />
                <button className="bg-workspace-base border border-workspace-border text-ide-text px-6 py-2 rounded font-bold hover:border-ide-violet transition-colors">Update Password</button>
              </div>
            </div>

            <div className="pt-6 border-t border-workspace-border">
              <label className="block text-sm font-bold text-ide-muted uppercase tracking-wider mb-2 text-red-500">Danger Zone</label>
              <p className="text-sm text-ide-muted mb-4">Permanently delete your account and all associated pastes. This action cannot be undone.</p>
              <button className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-2 rounded font-bold hover:bg-red-500 hover:text-white transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
