import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { getAIProvider, getAIConfig, hexToRgb, rgbToHsl, getContrastRatio } from '../ai';
import type { Project, ColorToken, ContrastResult } from '../types';
import {
  FileText, Image, Palette, Type, Shapes, Grid3X3, Camera,
  MessageSquare, Sparkles, CheckCircle2, ArrowLeft, Send,
  Eye, Download, Layers, ChevronRight, Info, X,
  RotateCcw, Target, Lightbulb
} from 'lucide-react';

const MODULES = [
  { id: 'brief', label: 'Brand Brief', icon: FileText },
  { id: 'logo', label: 'Logo Lab', icon: Image },
  { id: 'color', label: 'Color Lab', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'graphics', label: 'Graphic System', icon: Shapes },
  { id: 'patterns', label: 'Pattern Lab', icon: Grid3X3 },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'applications', label: 'Applications', icon: Layers },
  { id: 'presentation', label: 'Presentation', icon: Sparkles },
];

export function Workspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, setActiveProject, updateProgress, toggleCopilot, copilotOpen } = useStore();
  const project = projects.find(p => p.id === projectId);
  
  const rawModule = location.pathname.split('/').pop() || 'brief';
  const validModules = MODULES.map(m => m.id);
  const currentModule = validModules.includes(rawModule) ? rawModule : 'brief';

  useEffect(() => {
    if (projectId) setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-surface)]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[var(--color-border)] bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--color-border)]">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <ArrowLeft size={12} /> All Projects
          </button>
          <h2 className="font-semibold text-sm mt-2 truncate">{project.name}</h2>
          <div className="flex items-center gap-1 mt-2">
            {Object.entries(project.progress).map(([key, status]) => (
              <div key={key} className={`progress-dot ${status}`} title={`${key}: ${status}`} />
            ))}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            const progressKey = getProgressKey(mod.id);
            const status = progressKey ? project.progress[progressKey as keyof typeof project.progress] : null;
            
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`/workspace/${projectId}/${mod.id}`)}
                className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span className="flex-1 text-left">{mod.label}</span>
                {status && <div className={`progress-dot ${status}`} />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)] space-y-1">
          <button
            onClick={toggleCopilot}
            className={`sidebar-item w-full ${copilotOpen ? 'active' : ''}`}
          >
            <MessageSquare size={14} />
            <span>Creative Copilot</span>
          </button>
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-[10px]">
              <div className={`w-2 h-2 rounded-full ${getAIConfig().provider !== 'none' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-[var(--color-text-tertiary)]">
                {getAIConfig().provider !== 'none' ? 'AI Connected' : 'AI Disabled'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {currentModule === 'brief' && <BriefModule project={project} />}
        {currentModule === 'logo' && <LogoModule project={project} />}
        {currentModule === 'color' && <ColorModule project={project} />}
        {currentModule === 'typography' && <TypographyModule project={project} />}
        {currentModule === 'graphics' && <GraphicsModule project={project} />}
        {currentModule === 'patterns' && <PatternsModule project={project} />}
        {currentModule === 'photography' && <PhotographyModule project={project} />}
        {currentModule === 'applications' && <ApplicationsModule project={project} />}
        {currentModule === 'presentation' && <PresentationModule project={project} />}
      </main>

      {/* Creative Copilot */}
      {copilotOpen && <CopilotPanel project={project} />}
    </div>
  );
}

function getProgressKey(moduleId: string): string | null {
  const map: Record<string, string> = {
    logo: 'logo', color: 'color', typography: 'type',
    graphics: 'graphics', photography: 'photo', patterns: 'graphics',
  };
  return map[moduleId] || null;
}

// ==================== BRIEF MODULE ====================
function BriefModule({ project }: { project: Project }) {
  const { setBrief, updateProgress } = useStore();
  const [form, setForm] = useState(project.brief || {
    product: '', audience: '', personality: [], attributes: [],
    positioning: '', tone: '', competitors: [], references: [], avoid: []
  });
  const [personalityInput, setPersonalityInput] = useState('');
  const ai = getAIProvider();
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setBrief(project.id, form);
    updateProgress(project.id, 'logo', 'working');
  };

  const handleAiAssist = async () => {
    setLoading(true);
    try {
      const result = await ai.chat(
        [{ role: 'user', content: `Help me refine the brand brief for ${project.name}. Industry: ${project.industry}. Description: ${project.description}` }],
        project
      );
      setAiSuggestion(result);
    } catch (error: any) {
      setAiSuggestion(`⚠️ ${error.message || 'AI not available'}. Please configure your AI provider in Settings or fill in the brief manually.`);
    }
    setLoading(false);
  };

  const addPersonality = () => {
    if (personalityInput.trim() && !form.personality.includes(personalityInput.trim())) {
      setForm({ ...form, personality: [...form.personality, personalityInput.trim()] });
      setPersonalityInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 module-transition">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Brand Brief</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Define the strategic foundation. Only what affects visual decisions.</p>
        </div>
        <button onClick={handleAiAssist} className="btn-secondary flex items-center gap-2" disabled={loading}>
          <Sparkles size={14} className={loading ? 'animate-pulse-soft' : ''} />
          {loading ? 'Thinking...' : 'AI Assist'}
        </button>
      </div>

      {aiSuggestion && (
        <div className="panel p-4 mb-6 border-l-4 border-l-[var(--color-accent)]">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text-secondary)]">{aiSuggestion}</p>
          </div>
          <button onClick={() => setAiSuggestion('')} className="text-xs text-[var(--color-text-tertiary)] mt-2 hover:text-[var(--color-text-primary)]">Dismiss</button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="label mb-1.5 block">Product / Service</label>
          <input className="input-field" placeholder="What does the brand offer?" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
        </div>
        <div>
          <label className="label mb-1.5 block">Target Audience</label>
          <input className="input-field" placeholder="Who is this for?" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
        </div>
        <div>
          <label className="label mb-1.5 block">Brand Personality</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.personality.map((p) => (
              <span key={p} className="badge badge-proposed">{p}
                <button onClick={() => setForm({ ...form, personality: form.personality.filter(x => x !== p) })} className="ml-1"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field" placeholder="e.g. Bold, Refined, Playful" value={personalityInput} onChange={(e) => setPersonalityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPersonality()} />
            <button onClick={addPersonality} className="btn-secondary shrink-0">Add</button>
          </div>
        </div>
        <div>
          <label className="label mb-1.5 block">Positioning</label>
          <input className="input-field" placeholder="How is this brand different?" value={form.positioning} onChange={(e) => setForm({ ...form, positioning: e.target.value })} />
        </div>
        <div>
          <label className="label mb-1.5 block">Tone of Voice</label>
          <input className="input-field" placeholder="e.g. Confident, Warm, Technical" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} />
        </div>
        <div>
          <label className="label mb-1.5 block">Things to Avoid</label>
          <input className="input-field" placeholder="e.g. Clip art, neon colors, overly playful" value={form.avoid.join(', ')} onChange={(e) => setForm({ ...form, avoid: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="btn-primary">Save Brief & Continue</button>
      </div>
    </div>
  );
}

// ==================== LOGO MODULE ====================
function LogoModule({ project }: { project: Project }) {
  const { updateProgress } = useStore();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ai = getAIProvider();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!logoUrl) return;
    setAnalyzing(true);
    try {
      const result = await ai.analyzeLogo(logoUrl);
      setAnalysis(result);
      updateProgress(project.id, 'logo', 'working');
    } catch (error: any) {
      setAnalysis({
        geometry: [],
        shapes: [],
        angles: [],
        colors: [],
        complexity: 'moderate',
        symmetry: 'asymmetric',
        suggestions: [`⚠️ ${error.message || 'AI analysis failed'}. Please configure your AI provider in Settings.`],
      });
    }
    setAnalyzing(false);
  };

  const handleApprove = () => {
    updateProgress(project.id, 'logo', 'approved');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Logo Lab</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Upload, analyze, and prepare your logo for the identity system.</p>
        </div>
        {analysis && (
          <button onClick={handleApprove} className="btn-primary flex items-center gap-2">
            <CheckCircle2 size={14} /> Approve Logo
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upload / Preview */}
        <div className="panel p-6">
          <h3 className="label mb-4">Logo</h3>
          {logoUrl ? (
            <div className="space-y-4">
              <div className="aspect-square bg-[var(--color-surface)] rounded-lg flex items-center justify-center p-8 border border-[var(--color-border-subtle)]">
                <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs">Replace</button>
                {!analysis && (
                  <button onClick={handleAnalyze} className="btn-primary text-xs flex items-center gap-2" disabled={analyzing}>
                    {analyzing ? <><span className="animate-pulse-soft">Analyzing...</span></> : <><Eye size={12} /> Analyze</>}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-square border-2 border-dashed border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all"
            >
              <Image size={32} className="text-[var(--color-text-tertiary)] mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">Upload logo</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">SVG or PNG</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/svg+xml,image/png" className="hidden" onChange={handleUpload} />
        </div>

        {/* Analysis */}
        <div className="panel p-6">
          <h3 className="label mb-4">Analysis</h3>
          {analyzing ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[var(--color-text-secondary)]">Analyzing logo...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div>
                <span className="label">Complexity</span>
                <p className="text-sm mt-1 capitalize">{analysis.complexity}</p>
              </div>
              <div>
                <span className="label">Symmetry</span>
                <p className="text-sm mt-1 capitalize">{analysis.symmetry}</p>
              </div>
              <div>
                <span className="label">Detected Geometry</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {analysis.geometry.map((g: string) => (
                    <span key={g} className="badge badge-draft">{g}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Detected Colors</span>
                <div className="flex gap-2 mt-2">
                  {analysis.colors.map((c: string) => (
                    <div key={c} className="w-8 h-8 rounded-md border border-[var(--color-border-subtle)]" style={{ background: c }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Suggestions</span>
                <ul className="mt-2 space-y-2">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Lightbulb size={12} className="text-[var(--color-warning)] mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-center">
              <div>
                <Info size={20} className="text-[var(--color-text-tertiary)] mx-auto mb-2" />
                <p className="text-sm text-[var(--color-text-secondary)]">Upload a logo to begin analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Tests */}
      {logoUrl && (
        <div className="panel p-6 mt-6">
          <h3 className="label mb-4">Size Reduction Test</h3>
          <div className="flex items-end gap-6">
            {[120, 64, 48, 32, 24, 16].map((size) => (
              <div key={size} className="text-center">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-md flex items-center justify-center p-2" style={{ width: size + 16, height: size + 16 }}>
                  <img src={logoUrl} alt="" style={{ maxHeight: size, maxWidth: size }} className="object-contain" />
                </div>
                <span className="text-[10px] text-[var(--color-text-tertiary)] mt-1 block">{size}px</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context Tests */}
      {logoUrl && (
        <div className="panel p-6 mt-6">
          <h3 className="label mb-4">Context Tests</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { bg: '#FFFFFF', label: 'Light' },
              { bg: '#F4F4F5', label: 'Neutral' },
              { bg: '#27272A', label: 'Dark' },
              { bg: '#000000', label: 'Black' },
            ].map((ctx) => (
              <div key={ctx.label} className="aspect-square rounded-lg flex items-center justify-center p-6 border border-[var(--color-border-subtle)]" style={{ background: ctx.bg }}>
                <img src={logoUrl} alt="" className="max-w-full max-h-full object-contain" style={{ filter: ctx.bg === '#000000' ? 'brightness(10)' : 'none' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== COLOR MODULE ====================
function ColorModule({ project }: { project: Project }) {
  const { setColors, updateProgress } = useStore();
  const [generating, setGenerating] = useState(false);
  const [tokens, setTokens] = useState<ColorToken[]>(project.colors?.tokens || []);
  const [contrastMatrix, setContrastMatrix] = useState<ContrastResult[]>([]);
  const ai = getAIProvider();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const logoColors = ['#2563EB']; // Would extract from logo
      const suggestions = await ai.generateColors(project.brief, logoColors);
      const newTokens: ColorToken[] = suggestions.map((s, i) => {
        const rgb = hexToRgb(s.hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return {
          id: crypto.randomUUID(),
          name: s.role.charAt(0).toUpperCase() + s.role.slice(1),
          role: s.role as ColorToken['role'],
          hex: s.hex,
          rgb, hsl,
          status: 'PROPOSED' as const,
        };
      });
      setTokens(newTokens);
      
      // Generate contrast matrix
      const matrix: ContrastResult[] = [];
      const textTokens = newTokens.filter(t => t.role === 'text' || t.role === 'primary');
      const bgTokens = newTokens.filter(t => t.role === 'background' || t.role === 'surface');
      textTokens.forEach(fg => {
        bgTokens.forEach(bg => {
          const ratio = getContrastRatio(fg.hex, bg.hex);
          matrix.push({ foreground: fg.hex, background: bg.hex, ratio: Math.round(ratio * 100) / 100, aa: ratio >= 4.5, aaa: ratio >= 7, aaLarge: ratio >= 3 });
        });
      });
      setContrastMatrix(matrix);
      setColors(project.id, { tokens: newTokens, harmony: 'analogous', temperature: 'neutral', contrastMatrix: matrix });
      updateProgress(project.id, 'color', 'working');
    } catch (error: any) {
      alert(`⚠️ ${error.message || 'Failed to generate colors'}. Please configure your AI provider in Settings.`);
    }
    setGenerating(false);
  };

  const handleApprove = () => {
    updateProgress(project.id, 'color', 'approved');
  };

  const handleColorEdit = (id: string, hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setTokens(tokens.map(t => t.id === id ? { ...t, hex, rgb, hsl } : t));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Color Lab</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Build a coherent color system with roles, not just swatches.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2" disabled={generating}>
            <Sparkles size={14} className={generating ? 'animate-pulse-soft' : ''} />
            {generating ? 'Generating...' : 'Generate Palette'}
          </button>
          {tokens.length > 0 && (
            <button onClick={handleApprove} className="btn-primary flex items-center gap-2">
              <CheckCircle2 size={14} /> Approve
            </button>
          )}
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="panel p-12 text-center">
          <Palette size={32} className="text-[var(--color-text-tertiary)] mx-auto mb-3" />
          <h3 className="font-medium mb-1">No colors yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Generate a palette based on your brand brief and logo.</p>
          <button onClick={handleGenerate} className="btn-primary">Generate Palette</button>
        </div>
      ) : (
        <>
          {/* Color Tokens */}
          <div className="panel p-6 mb-6">
            <h3 className="label mb-4">Color Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tokens.map((token) => (
                <div key={token.id} className="group">
                  <div className="aspect-[4/3] rounded-lg mb-2 relative overflow-hidden border border-[var(--color-border-subtle)]">
                    <div className="absolute inset-0" style={{ background: token.hex }} />
                    <input
                      type="color"
                      value={token.hex}
                      onChange={(e) => handleColorEdit(token.id, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">{token.hex}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{token.name}</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)]">{token.role}</p>
                    </div>
                    <span className={`badge badge-${token.status.toLowerCase()}`}>{token.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrast Matrix */}
          {contrastMatrix.length > 0 && (
            <div className="panel p-6">
              <h3 className="label mb-4">Contrast Matrix (WCAG)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <th className="text-left py-2 pr-4 label">Combination</th>
                      <th className="text-center py-2 px-3 label">Ratio</th>
                      <th className="text-center py-2 px-3 label">AA</th>
                      <th className="text-center py-2 px-3 label">AA Large</th>
                      <th className="text-center py-2 px-3 label">AAA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrastMatrix.map((row, i) => (
                      <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ background: row.foreground }} />
                            <span className="text-[var(--color-text-tertiary)]">on</span>
                            <div className="w-4 h-4 rounded border border-[var(--color-border-subtle)]" style={{ background: row.background }} />
                            <span className="font-mono">{row.ratio}:1</span>
                          </div>
                        </td>
                        <td className="text-center py-2">
                          <span className={`badge ${row.aa ? 'badge-approved' : 'badge-draft'}`}>{row.aa ? 'PASS' : 'FAIL'}</span>
                        </td>
                        <td className="text-center py-2">
                          <span className={`badge ${row.aaLarge ? 'badge-approved' : row.ratio >= 2.5 ? 'badge-proposed' : 'badge-draft'}`}>
                            {row.aaLarge ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                        <td className="text-center py-2">
                          <span className={`badge ${row.aaa ? 'badge-approved' : 'badge-draft'}`}>{row.aaa ? 'PASS' : 'FAIL'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Color Values */}
          <div className="panel p-6 mt-6">
            <h3 className="label mb-4">Color Values</h3>
            <div className="space-y-3">
              {tokens.map((token) => (
                <div key={token.id} className="flex items-center gap-4 text-xs">
                  <div className="w-6 h-6 rounded" style={{ background: token.hex }} />
                  <span className="w-20 font-medium">{token.name}</span>
                  <span className="font-mono text-[var(--color-text-secondary)]">{token.hex}</span>
                  <span className="font-mono text-[var(--color-text-tertiary)]">rgb({token.rgb.r}, {token.rgb.g}, {token.rgb.b})</span>
                  <span className="font-mono text-[var(--color-text-tertiary)]">hsl({token.hsl.h}, {token.hsl.s}%, {token.hsl.l}%)</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== TYPOGRAPHY MODULE ====================
function TypographyModule({ project }: { project: Project }) {
  const { setTypography, updateProgress } = useStore();
  const [generating, setGenerating] = useState(false);
  const [directions, setDirections] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);
  const ai = getAIProvider();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const suggestions = await ai.suggestTypography(project.brief, project.brief?.personality || []);
      setDirections([
        { name: 'Direction A', fonts: suggestions },
        { name: 'Direction B', fonts: suggestions.map((s: any) => ({ ...s, family: s.family === 'Inter' ? 'DM Sans' : 'Inter' })) },
        { name: 'Direction C', fonts: suggestions.map((s: any) => ({ ...s, family: s.family === 'Inter' ? 'Work Sans' : 'Source Serif Pro' })) },
      ]);
      updateProgress(project.id, 'type', 'working');
    } catch (error: any) {
      alert(`⚠️ ${error.message || 'Failed to generate typography'}. Please configure your AI provider in Settings.`);
    }
    setGenerating(false);
  };

  const handleApprove = () => {
    const dir = directions[selected];
    if (!dir) return;
    const display = dir.fonts.find((f: any) => f.role === 'display');
    const body = dir.fonts.find((f: any) => f.role === 'body');
    setTypography(project.id, {
      display: display ? { family: display.family, weight: 700, style: 'normal', size: 48, lineHeight: 1.1, letterSpacing: -0.02 } : undefined,
      heading: { family: display?.family || 'DM Serif Display', weight: 600, style: 'normal', size: 32, lineHeight: 1.2, letterSpacing: -0.01 },
      body: body ? { family: body.family, weight: 400, style: 'normal', size: 16, lineHeight: 1.6, letterSpacing: 0 } : undefined,
      scale: {
        base: 16, ratio: 1.25,
        levels: [
          { name: 'Caption', size: 12, lineHeight: 1.4, weight: 500 },
          { name: 'Body', size: 16, lineHeight: 1.6, weight: 400 },
          { name: 'H3', size: 20, lineHeight: 1.3, weight: 600 },
          { name: 'H2', size: 28, lineHeight: 1.2, weight: 600 },
          { name: 'H1', size: 40, lineHeight: 1.1, weight: 700 },
          { name: 'Display', size: 56, lineHeight: 1.05, weight: 700 },
        ]
      },
      status: 'APPROVED',
    });
    updateProgress(project.id, 'type', 'approved');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Typography Lab</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Build a type system with hierarchy, not just font selection.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2" disabled={generating}>
            <Sparkles size={14} className={generating ? 'animate-pulse-soft' : ''} />
            {generating ? 'Generating...' : 'Suggest Type System'}
          </button>
          {directions.length > 0 && (
            <button onClick={handleApprove} className="btn-primary flex items-center gap-2">
              <CheckCircle2 size={14} /> Approve
            </button>
          )}
        </div>
      </div>

      {directions.length === 0 ? (
        <div className="panel p-12 text-center">
          <Type size={32} className="text-[var(--color-text-tertiary)] mx-auto mb-3" />
          <h3 className="font-medium mb-1">No type system yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Generate typographic directions based on your brand personality.</p>
          <button onClick={handleGenerate} className="btn-primary">Generate Directions</button>
        </div>
      ) : (
        <>
          {/* Direction Tabs */}
          <div className="flex gap-2 mb-6">
            {directions.map((dir, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected === i ? 'bg-black text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'}`}
              >
                {dir.name}
              </button>
            ))}
          </div>

          {/* Type Preview */}
          <div className="panel p-8 mb-6">
            {directions[selected]?.fonts.map((font: any, i: number) => (
              <div key={i} className="mb-8 last:mb-0">
                <span className="label">{font.role}</span>
                <p className="mt-2 text-[var(--color-text-secondary)] text-xs mb-1">{font.family} — {font.reasoning}</p>
                <p style={{ fontFamily: font.family, fontSize: font.role === 'display' ? 48 : font.role === 'body' ? 16 : 24, fontWeight: font.role === 'body' ? 400 : 700, lineHeight: 1.2 }}>
                  {font.role === 'display' ? `${project.name}` : font.role === 'body' ? 'The quick brown fox jumps over the lazy dog. Brand typography should feel intentional and harmonious.' : 'Section Heading'}
                </p>
                {font.pairing && <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Pairs with: {font.pairing}</p>}
              </div>
            ))}
          </div>

          {/* Type Scale */}
          <div className="panel p-6">
            <h3 className="label mb-4">Type Scale (1.25 ratio)</h3>
            <div className="space-y-3">
              {[
                { name: 'Display', size: 56, weight: 700 },
                { name: 'H1', size: 40, weight: 700 },
                { name: 'H2', size: 28, weight: 600 },
                { name: 'H3', size: 20, weight: 600 },
                { name: 'Body', size: 16, weight: 400 },
                { name: 'Caption', size: 12, weight: 500 },
              ].map((level) => (
                <div key={level.name} className="flex items-baseline gap-4">
                  <span className="w-16 text-[10px] text-[var(--color-text-tertiary)] text-right">{level.name}</span>
                  <span style={{ fontSize: level.size, fontWeight: level.weight, lineHeight: 1.2 }} className="truncate">
                    {project.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] ml-auto shrink-0">{level.size}px / {level.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== GRAPHICS MODULE ====================
function GraphicsModule({ project }: { project: Project }) {
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const directions = [
    { id: 'geometric', name: 'Geometric', description: 'Precise shapes, grids, and mathematical patterns derived from logo geometry.', icon: '◆' },
    { id: 'organic', name: 'Organic', description: 'Flowing curves, natural forms, and soft transitions inspired by logo arcs.', icon: '◐' },
    { id: 'expressive', name: 'Expressive', description: 'Bold marks, dynamic compositions, and energetic graphic elements.', icon: '✦' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Graphic System</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Develop a visual language that grows from your identity.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {directions.map((dir) => (
          <button
            key={dir.id}
            onClick={() => setSelectedDirection(dir.id)}
            className={`panel p-6 text-left transition-all hover:shadow-md ${selectedDirection === dir.id ? 'ring-2 ring-black' : ''}`}
          >
            <span className="text-3xl mb-3 block">{dir.icon}</span>
            <h3 className="font-semibold text-sm mb-1">{dir.name}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">{dir.description}</p>
          </button>
        ))}
      </div>

      {selectedDirection && (
        <div className="panel p-6 fade-in">
          <h3 className="label mb-4">Graphic Elements — {selectedDirection}</h3>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  {selectedDirection === 'geometric' && <rect x="8" y="8" width="24" height="24" fill="none" stroke="#171717" strokeWidth="2" transform={`rotate(${i * 15} 20 20)`} />}
                  {selectedDirection === 'organic' && <circle cx="20" cy="20" r={8 + i * 1.5} fill="none" stroke="#171717" strokeWidth="1.5" />}
                  {selectedDirection === 'expressive' && <path d={`M${10 + i} 30 Q20 ${10 - i} ${30 - i} 30`} fill="none" stroke="#171717" strokeWidth="2" />}
                </svg>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary flex items-center gap-2">
              <CheckCircle2 size={14} /> Approve Direction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PATTERNS MODULE ====================
function PatternsModule({ project }: { project: Project }) {
  const [scale, setScale] = useState(1);
  const [spacing, setSpacing] = useState(20);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Pattern Lab</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Create patterns derived from your logo geometry and brand elements.</p>
      </div>

      {/* Controls */}
      <div className="panel p-6 mb-6">
        <h3 className="label mb-4">Pattern Controls</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Scale: {scale}x</label>
            <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="range-input" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Spacing: {spacing}px</label>
            <input type="range" min="5" max="50" step="1" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value))} className="range-input" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Rotation: {rotation}°</label>
            <input type="range" min="0" max="360" step="5" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="range-input" />
          </div>
        </div>
      </div>

      {/* Pattern Preview */}
      <div className="panel p-6">
        <h3 className="label mb-4">Preview</h3>
        <div className="aspect-[16/9] bg-white rounded-lg overflow-hidden border border-[var(--color-border-subtle)]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="brandPattern" x="0" y="0" width={spacing * scale} height={spacing * scale} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
                <circle cx={spacing * scale / 2} cy={spacing * scale / 2} r={3 * scale} fill="#2563EB" opacity="0.3" />
                <rect x={spacing * scale / 2 - 1.5 * scale} y={spacing * scale / 2 - 1.5 * scale} width={3 * scale} height={3 * scale} fill="none" stroke="#2563EB" strokeWidth="0.5" opacity="0.2" transform={`rotate(45 ${spacing * scale / 2} ${spacing * scale / 2})`} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brandPattern)" />
          </svg>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="panel p-6 mt-6">
        <h3 className="label mb-4">Usage Examples</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-[var(--color-border-subtle)]">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)' }}>
              <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#brandPattern)" opacity="0.3" /></svg>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] text-white/70">Card Background</span>
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#brandPattern)" /></svg>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] text-[var(--color-text-tertiary)]">Subtle Background</span>
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-[var(--color-border-subtle)] bg-black">
            <div className="absolute inset-0 opacity-40">
              <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#brandPattern)" /></svg>
            </div>
            <span className="absolute bottom-2 left-2 text-[10px] text-white/50">Dark Application</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PHOTOGRAPHY MODULE ====================
function PhotographyModule({ project }: { project: Project }) {
  const [generating, setGenerating] = useState(false);
  const [direction, setDirection] = useState<any>(null);
  const ai = getAIProvider();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const colors = project.colors?.tokens.map(t => t.hex) || ['#2563EB'];
      const result = await ai.suggestPhotography(project.brief, colors);
      setDirection(result);
    } catch (error: any) {
      alert(`⚠️ ${error.message || 'Failed to generate photography direction'}. Please configure your AI provider in Settings.`);
    }
    setGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Photography Direction</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Define a consistent visual language for brand imagery.</p>
        </div>
        <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2" disabled={generating}>
          <Sparkles size={14} className={generating ? 'animate-pulse-soft' : ''} />
          {generating ? 'Generating...' : 'Generate Direction'}
        </button>
      </div>

      {!direction ? (
        <div className="panel p-12 text-center">
          <Camera size={32} className="text-[var(--color-text-tertiary)] mx-auto mb-3" />
          <h3 className="font-medium mb-1">No photography direction yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Generate a photography direction based on your brand identity.</p>
          <button onClick={handleGenerate} className="btn-primary">Generate Direction</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="label mb-4">Direction</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Subjects</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {direction.subjects.map((s: string) => (
                    <span key={s} className="badge badge-draft">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Lighting</span>
                <p className="text-sm mt-2">{direction.lighting}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Mood</span>
                <p className="text-sm mt-2">{direction.mood}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Color Treatment</span>
                <p className="text-sm mt-2">{direction.treatment}</p>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="label mb-4">References</h3>
            <div className="grid grid-cols-3 gap-4">
              {direction.references.map((ref: string, i: number) => (
                <div key={i} className="aspect-video bg-gradient-to-br from-[var(--color-surface)] to-[#E5E5E5] rounded-lg flex items-center justify-center border border-[var(--color-border-subtle)]">
                  <span className="text-xs text-[var(--color-text-tertiary)]">{ref}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="label mb-4">Mood Grid</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg" style={{
                  background: `linear-gradient(${45 + i * 30}deg, ${project.colors?.tokens[0]?.hex || '#2563EB'}${20 + i * 10}, ${project.colors?.tokens[1]?.hex || '#1E40AF'}${30 + i * 8})`
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== APPLICATIONS MODULE ====================
function ApplicationsModule({ project }: { project: Project }) {
  const applications = [
    { name: 'Business Card', type: 'stationery', icon: '📇' },
    { name: 'Letterhead', type: 'stationery', icon: '📄' },
    { name: 'Instagram Post', type: 'social', icon: '📱' },
    { name: 'Website Hero', type: 'digital', icon: '🖥️' },
    { name: 'Poster', type: 'print', icon: '🎨' },
    { name: 'Packaging', type: 'product', icon: '📦' },
    { name: 'Email Header', type: 'digital', icon: '✉️' },
    { name: 'Presentation', type: 'digital', icon: '📊' },
  ];

  const primaryColor = project.colors?.tokens.find(t => t.role === 'primary')?.hex || '#2563EB';

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">See your brand identity applied across touchpoints.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {applications.map((app) => (
          <div key={app.name} className="panel p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="aspect-[16/10] rounded-lg mb-3 overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{app.icon}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: primaryColor }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{app.name}</h3>
                <p className="text-[10px] text-[var(--color-text-tertiary)] capitalize">{app.type}</p>
              </div>
              <ChevronRight size={14} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== PRESENTATION MODULE ====================
function PresentationModule({ project }: { project: Project }) {
  const [style, setStyle] = useState<'editorial' | 'minimal' | 'experimental'>('editorial');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const primaryColor = project.colors?.tokens.find(t => t.role === 'primary')?.hex || '#2563EB';

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
    }, 1500);
  };

  const sections = [
    { title: 'Cover', desc: 'Brand name and visual identity' },
    { title: 'Concept', desc: 'Strategic foundation and direction' },
    { title: 'Logo', desc: 'Logo system and variants' },
    { title: 'Color', desc: 'Color palette and system' },
    { title: 'Typography', desc: 'Type system and hierarchy' },
    { title: 'Graphics', desc: 'Graphic language and patterns' },
    { title: 'Applications', desc: 'Brand in context' },
    { title: 'Closing', desc: 'Summary and next steps' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Brand Presentation</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Generate a professional brand presentation using your approved identity.</p>
      </div>

      {/* Style Selection */}
      <div className="panel p-6 mb-6">
        <h3 className="label mb-4">Presentation Style</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['editorial', 'minimal', 'experimental'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center transition-all ${style === s ? 'border-black' : 'border-[var(--color-border-subtle)] hover:border-[var(--color-text-tertiary)]'}`}
            >
              <span className="text-sm font-medium capitalize">{s}</span>
              <span className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                {s === 'editorial' && 'Magazine-like layout'}
                {s === 'minimal' && 'Clean and spacious'}
                {s === 'experimental' && 'Bold and dynamic'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="panel p-6 mb-6">
        <h3 className="label mb-4">Sections</h3>
        <div className="space-y-2">
          {sections.map((section, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--color-border-subtle)] last:border-0">
              <span className="text-xs text-[var(--color-text-tertiary)] w-6">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1">
                <span className="text-sm font-medium">{section.title}</span>
                <span className="text-xs text-[var(--color-text-tertiary)] ml-2">{section.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate */}
      <div className="flex justify-center">
        <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-8 py-3" disabled={generating}>
          <Sparkles size={16} className={generating ? 'animate-pulse-soft' : ''} />
          {generating ? 'Generating Presentation...' : 'Generate Brand Presentation'}
        </button>
      </div>

      {/* Preview */}
      {generated && (
        <div className="mt-8 fade-in">
          <h3 className="label mb-4">Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Cover */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative" style={{ background: style === 'editorial' ? primaryColor : style === 'minimal' ? '#FAFAFA' : '#171717' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <span className={`text-2xl font-bold ${style === 'minimal' ? 'text-black' : 'text-white'}`}>{project.name}</span>
                <span className={`text-xs mt-2 ${style === 'minimal' ? 'text-[var(--color-text-tertiary)]' : 'text-white/60'}`}>Brand Identity</span>
              </div>
              {style === 'experimental' && <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-full" />}
            </div>
            {/* Color Section */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-white p-8 flex flex-col">
              <span className="label">Color System</span>
              <div className="flex-1 flex items-center gap-3 mt-4">
                {project.colors?.tokens.slice(0, 5).map((token) => (
                  <div key={token.id} className="flex-1 aspect-square rounded-lg" style={{ background: token.hex }} />
                ))}
              </div>
              <div className="mt-4 space-y-1">
                {project.colors?.tokens.slice(0, 3).map((token) => (
                  <div key={token.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: token.hex }} />
                    <span className="text-[10px] text-[var(--color-text-secondary)]">{token.name}</span>
                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">{token.hex}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Typography Section */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-white p-8">
              <span className="label">Typography</span>
              <p className="text-3xl font-bold mt-4 tracking-tight">{project.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-3">Aa Bb Cc Dd Ee Ff Gg</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                {project.typography?.body?.family || 'System'} · {project.typography?.display?.family || 'System'}
              </p>
            </div>
            {/* Applications */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative" style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl">📇</span>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2">Applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="mt-6 flex justify-center gap-3">
            <button className="btn-primary flex items-center gap-2">
              <Download size={14} /> Export PDF
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download size={14} /> Export Images
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== COPILOT PANEL ====================
function CopilotPanel({ project }: { project: Project }) {
  const { copilotMessages, addCopilotMessage, toggleCopilot } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ai = getAIProvider();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    addCopilotMessage('user', input);
    setInput('');
    setLoading(true);
    try {
      const response = await ai.chat(
        [...copilotMessages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: input }],
        project
      );
      addCopilotMessage('assistant', response);
    } catch (error: any) {
      addCopilotMessage('assistant', `⚠️ ${error.message || 'AI unavailable'}. Please configure your AI provider in Settings.`);
    }
    setLoading(false);
  };

  const quickActions = [
    { label: 'Analyze', icon: Eye },
    { label: 'Improve', icon: Target },
    { label: 'Alternatives', icon: RotateCcw },
    { label: 'Why?', icon: Lightbulb },
  ];

  return (
    <div className="w-80 copilot-panel flex flex-col shrink-0">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--color-accent)]" />
          <span className="text-sm font-semibold">Creative Copilot</span>
        </div>
        <button onClick={toggleCopilot} className="p-1 rounded hover:bg-[var(--color-surface)]">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {copilotMessages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles size={20} className="text-[var(--color-text-tertiary)] mx-auto mb-2" />
            <p className="text-xs text-[var(--color-text-secondary)]">Ask me anything about your brand.</p>
            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">I know your brief, colors, type, and more.</p>
          </div>
        )}
        {copilotMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${msg.role === 'user' ? 'bg-black text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-surface)] rounded-lg px-3 py-2 text-xs text-[var(--color-text-secondary)]">
              <span className="animate-pulse-soft">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] flex gap-1.5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} onClick={() => { setInput(action.label.toLowerCase()); }} className="btn-ghost text-[10px] py-1 px-2 flex items-center gap-1">
              <Icon size={10} /> {action.label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            className="input-field text-xs"
            placeholder="Ask about your brand..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors" disabled={!input.trim() || loading}>
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
