import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Plus, MoreVertical, Copy, Trash2, Folder, ArrowRight } from 'lucide-react';

export function ProjectsPage() {
  const { projects, createProject, deleteProject, duplicateProject, setActiveProject } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', industry: '' });

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
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Brand Studio</h1>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} />
            New Project
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Projects</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Your brand identity workspaces. Start with a name and logo.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Folder size={24} className="text-[var(--color-text-tertiary)]" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Create your first brand project to get started.
            </p>
            <button onClick={() => setShowNew(true)} className="btn-primary">
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="panel p-5 cursor-pointer hover-lift group relative"
                onClick={() => handleOpen(project.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{project.industry || 'No industry'}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                    className="p-1 rounded hover:bg-[var(--color-surface)] opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* New Project Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-1">New Project</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Start with the essentials. You can add more later.</p>
            
            <div className="space-y-4">
              <div>
                <label className="label mb-1.5 block">Brand Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Meridian"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className="label mb-1.5 block">Industry / Category</label>
                <select
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
                <label className="label mb-1.5 block">Short Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="What does this brand do?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreate} className="btn-primary" disabled={!form.name.trim()}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
