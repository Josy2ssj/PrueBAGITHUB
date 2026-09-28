import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, ModuleProgress, BrandBrief, ColorSystem, TypographySystem, Pattern, PhotographyDirection, IconSystem, Presentation, AIProposal, ApprovalStatus } from './types';

interface AppState {
  projects: Project[];
  activeProjectId: string | null;
  copilotOpen: boolean;
  copilotMessages: { role: 'user' | 'assistant'; content: string; timestamp: number }[];
  
  // Actions
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => string;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProgress: (id: string, module: keyof ModuleProgress, status: 'pending' | 'working' | 'approved') => void;
  setBrief: (projectId: string, brief: BrandBrief) => void;
  setColors: (projectId: string, colors: ColorSystem) => void;
  setTypography: (projectId: string, typography: TypographySystem) => void;
  setPatterns: (projectId: string, patterns: Pattern[]) => void;
  setPhotography: (projectId: string, photography: PhotographyDirection) => void;
  setIconography: (projectId: string, iconography: IconSystem) => void;
  setPresentation: (projectId: string, presentation: Presentation) => void;
  toggleCopilot: () => void;
  addCopilotMessage: (role: 'user' | 'assistant', content: string) => void;
  getActiveProject: () => Project | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      copilotOpen: false,
      copilotMessages: [],

      createProject: (projectData) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const project: Project = {
          ...projectData,
          id,
          createdAt: now,
          updatedAt: now,
          progress: {
            logo: 'pending',
            color: 'pending',
            type: 'pending',
            graphics: 'pending',
            photo: 'pending',
            icons: 'pending',
          },
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return id;
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        }));
      },

      duplicateProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const newId = crypto.randomUUID();
        const now = Date.now();
        const duplicate: Project = {
          ...JSON.parse(JSON.stringify(project)),
          id: newId,
          name: `${project.name} (copy)`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ projects: [...state.projects, duplicate] }));
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
        }));
      },

      updateProgress: (id, module, status) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, progress: { ...p.progress, [module]: status }, updatedAt: Date.now() } : p
          ),
        }));
      },

      setBrief: (projectId, brief) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, brief, updatedAt: Date.now() } : p
          ),
        }));
      },

      setColors: (projectId, colors) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, colors, updatedAt: Date.now() } : p
          ),
        }));
      },

      setTypography: (projectId, typography) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, typography, updatedAt: Date.now() } : p
          ),
        }));
      },

      setPatterns: (projectId, patterns) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, patterns, updatedAt: Date.now() } : p
          ),
        }));
      },

      setPhotography: (projectId, photography) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, photography, updatedAt: Date.now() } : p
          ),
        }));
      },

      setIconography: (projectId, iconography) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, iconography, updatedAt: Date.now() } : p
          ),
        }));
      },

      setPresentation: (projectId, presentation) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, presentation, updatedAt: Date.now() } : p
          ),
        }));
      },

      toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),

      addCopilotMessage: (role, content) => {
        set((state) => ({
          copilotMessages: [...state.copilotMessages, { role, content, timestamp: Date.now() }],
        }));
      },

      getActiveProject: () => {
        const state = get();
        return state.projects.find((p) => p.id === state.activeProjectId) || null;
      },
    }),
    {
      name: 'brand-studio-storage',
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        copilotMessages: state.copilotMessages,
      }),
    }
  )
);
