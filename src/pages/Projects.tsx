import { Dialog } from '../components/Dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getAIConfig, setAIConfig } from '../ai';
import { Plus, MoreVertical, Copy, Trash2, Folder, ArrowRight, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProjectsPage() {
  const { projects, createProject, deleteProject, duplicateProject, setActiveProject } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', industry: '' });
  const [query, setQuery] = useState('');
  const visibleProjects = projects.filter(p => `${p.name} ${p.industry}`.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const id = createProject({ name: form.name, description: form.description, industry: form.industry });
    setActiveProject(id);
    setShowNew(false);
    setForm({ name: '', description: '', industry: '' });
    navigate(`/workspace/${id}/brief`);
  };

  const handleOpen = (id: string) => {
    setActiveProject(id);
    navigate(`/workspace/${id}/brief`);
  };

  return (
    <div className="projects-page">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="studio-header">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Brand Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSettings(true)} className="btn-secondary flex items-center gap-2">
              <Settings size={14} />
              AI Settings
            </button>
            <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
              <Plus size={14} />
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="projects-content">
        <div className="projects-heading">
          <h2 className="projects-title">Projects</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Your brand identity workspaces. Start with a name and logo.
          </p>
        </div>

        {projects.length > 0 && <div className="projects-toolbar"><span>{projects.length} {projects.length === 1 ? 'project' : 'projects'} <span className="text-[var(--color-text-tertiary)]"> / Saved in this browser</span></span><input aria-label="Search projects" className="input-field project-search" placeholder="Search projects…" value={query} onChange={e => setQuery(e.target.value)} /></div>}
        {projects.length === 0 ? (
          <div className="empty-studio">
            <div className="empty-composition" aria-hidden="true"><div className="specimen-type">Aa<span>TYPE & FORM</span></div><div className="specimen-colors"><i /><i /><i /><i /></div><div className="specimen-mark"><Folder size={36} strokeWidth={1} /><span>YOUR NEXT IDENTITY</span></div></div>
            <h3 className="text-lg font-medium mb-2">A new identity starts here.</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Bring your name, your logo, and an idea. Build the rest here.
            </p>
            <button onClick={() => setShowNew(true)} className="btn-primary">
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="panel project-card p-5 group relative"
              >
                <button className="project-preview" aria-label={`Open ${project.name}`} onClick={() => handleOpen(project.id)}><span>{project.name.slice(0, 2)}</span><div className="project-swatches">{(project.colors?.tokens.slice(0, 5) || []).map(token => <i key={token.id} style={{ background: token.hex }} />)}</div><ArrowRight size={20} /></button>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate"><button onClick={() => handleOpen(project.id)}>{project.name}</button></h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{project.industry || 'No industry'}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                    aria-label={`Actions for ${project.name}`} aria-expanded={menuOpen === project.id} className="icon-button"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Progress */}
                <div className="flex items-center gap-1.5 mb-3">
                  {Object.entries(project.progress).map(([key, status]) => (
                    <div key={key} className={`progress-dot ${status}`} title={`${key}: ${status}`} />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--color-text-tertiary)]">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                  <ArrowRight size={14} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                </div>

                {/* Context Menu */}
                {menuOpen === project.id && (
                  <div className="absolute right-4 top-12 bg-white border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateProject(project.id); setMenuOpen(null); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--color-surface)] flex items-center gap-2"
                    >
                      <Copy size={12} /> Duplicate
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); setMenuOpen(null); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {projects.length > 0 && visibleProjects.length === 0 && <p className="search-empty">No projects match “{query}”. <button className="btn-ghost" onClick={() => setQuery('')}>Clear search</button></p>}
      {/* New Project Modal */}
      {showNew && (
        <Dialog title="New Project" onClose={() => setShowNew(false)}>
          <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
            <h2 className="text-lg font-semibold mb-1">New Project</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Start with the essentials. You can add more later.</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="project-field-1" className="label mb-1.5 block">Brand Name *</label>
                <input id="project-field-1"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Meridian"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="project-field-2" className="label mb-1.5 block">Industry / Category</label>
                <select id="project-field-2"
                  className="input-field"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="technology">Technology</option>
                  <option value="luxury">Luxury / Premium</option>
                  <option value="health">Health & Wellness</option>
                  <option value="food">Food & Beverage</option>
                  <option value="fashion">Fashion</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="creative">Creative / Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="project-field-3" className="label mb-1.5 block">Short Description</label>
                <textarea id="project-field-3"
                  className="input-field resize-none"
                  rows={2}
                  placeholder="What does this brand do?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button type="button" onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={!form.name.trim()}>
                Create Project
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* AI Settings Modal */}
      {showSettings && <AISettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function AISettingsModal({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState(getAIConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setAIConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Dialog title="AI Configuration" onClose={onClose}>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[var(--color-surface)] rounded-lg flex items-center justify-center">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Configuration</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">Connect a real AI provider</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="project-field-4" className="label mb-1.5 block">Provider</label>
            <select id="project-field-4"
              className="input-field"
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value as any, apiKey: '', model: '' })}
            >
              <option value="none">None (AI disabled)</option>
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          {config.provider !== 'none' && (
            <>
              <div>
                <label htmlFor="project-field-5" className="label mb-1.5 block">API Key</label>
                <input id="project-field-5"
                  type="password"
                  className="input-field font-mono text-xs"
                  placeholder={config.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                  Your key is stored locally in your browser. Never sent to our servers.
                </p>
              </div>

              <div>
                <label htmlFor="project-field-6" className="label mb-1.5 block">Model</label>
                <input id="project-field-6"
                  type="text"
                  className="input-field text-xs"
                  placeholder={config.provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022'}
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                />
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                  Leave empty for default model
                </p>
              </div>
            </>
          )}
        </div>

        {config.provider === 'none' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">AI is disabled</p>
                <p>Without an AI provider, you can still use all design tools manually, but AI-powered features (analysis, suggestions, copilot) will not work.</p>
              </div>
            </div>
          </div>
        )}

        {config.provider !== 'none' && config.apiKey && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
              <div className="text-xs text-green-800">
                <p className="font-medium">AI is configured</p>
                <p className="mt-0.5">Using {config.provider === 'openai' ? 'OpenAI' : 'Anthropic'} with {config.model || 'default model'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-8">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={handleSave} className="btn-primary">
            {saved ? '✓ Saved' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
