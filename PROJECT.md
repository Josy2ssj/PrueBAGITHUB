# Brand Studio — Project Documentation

## Purpose

Brand Studio is an intelligent brand identity studio that helps convert incomplete brands (name + logo) into complete, professional visual identities. It combines design knowledge, AI assistance, and systematic workflows.

## Architecture

```
src/
├── App.tsx              # Main routing + app shell
├── store.ts             # Zustand state management + persistence
├── types.ts             # TypeScript domain types
├── knowledge.ts         # Design Knowledge Base
├── ai.ts                # AI provider architecture
├── index.css            # Design system styles
└── pages/
    ├── Projects.tsx      # Project management
    └── Workspace.tsx     # All brand modules + copilot
```

## Modules

| Module | Status | Description |
|--------|--------|-------------|
| Projects | ✅ Complete | Create, open, duplicate, delete projects |
| Brand Brief | ✅ Complete | Strategic foundation with AI assist |
| Logo Lab | ✅ Complete | Upload, analyze, size/context tests |
| Color Lab | ✅ Complete | Generate palette, contrast matrix, values |
| Typography Lab | ✅ Complete | Type directions, scale, preview |
| Graphic System | ✅ Complete | Geometric/Organic/Expressive directions |
| Pattern Lab | ✅ Complete | Controls, preview, usage examples |
| Photography | ✅ Complete | AI-generated direction, mood grid |
| Applications | ✅ Complete | Touchpoint previews |
| Presentation | ✅ Complete | Style selection, section generation, preview |
| Creative Copilot | ✅ Complete | Contextual AI chat, quick actions |
| Design Knowledge Base | ✅ Complete | Rules, principles, recommendations |
| AI Provider Architecture | ✅ Complete | Abstracted interface + mock provider |

## Data Model

- **Project**: Core entity containing all brand data
- **BrandBrief**: Strategic inputs (personality, audience, positioning)
- **ColorSystem**: Tokens with roles, harmony, contrast matrix
- **TypographySystem**: Font configs, type scale, hierarchy
- **GraphicSystem**: Direction + elements
- **Pattern**: SVG patterns with controls
- **PhotographyDirection**: Subjects, lighting, mood, treatment
- **IconSystem**: Style parameters
- **Presentation**: Style + sections
- **DesignRule**: Knowledge base entries
- **AIProposal**: AI-generated suggestions

## AI Architecture

The AI layer is abstracted behind an `AIProvider` interface:

```typescript
interface AIProvider {
  analyzeLogo(imageData: string): Promise<LogoAnalysisResult>;
  generateColors(brief, logoColors): Promise<ColorSuggestion[]>;
  suggestTypography(brief, personality): Promise<TypographySuggestion[]>;
  generatePatterns(project): Promise<PatternSuggestion[]>;
  suggestPhotography(brief, colors): Promise<PhotographySuggestion>;
  chat(messages, context): Promise<string>;
  reviewDesign(element, context): Promise<ReviewResult[]>;
}
```

Current implementation: `MockAIProvider` — clearly identified as demo.
To integrate a real provider: implement the interface and call `setAIProvider()`.

## Persistence

Uses Zustand with `persist` middleware → localStorage.
Key: `brand-studio-storage`

## Design Knowledge Base

Located in `src/knowledge.ts`. Categories:
- Logo (5 rules)
- Color (5 rules)
- Typography (5 rules)
- Composition (5 rules)
- Graphics/Patterns (3 rules)
- Photography (3 rules)

Each rule has: type (verified/principle/recommendation/issue), severity, actionability.

## Limitations (V1)

- AI provider is mock/demo — no real generation
- No actual image generation for patterns/mockups
- Export is UI-only (PDF/image export needs backend or client-side library)
- No real file upload to server (client-side only)
- Photography references are text-based (no actual image search)
- No collaborative features

## What Needs External Provider

- Real AI analysis (vision models for logo analysis)
- Real color palette generation (LLM reasoning)
- Real typography suggestions (font database + reasoning)
- Real image generation (DALL-E, Midjourney, Stable Diffusion)
- Real PDF export (needs pdf-lib or server-side rendering)

## Next Steps (V2)

- Brand Strategy module
- Content system
- Campaign tools
- Real AI provider integration
- Cloud persistence
- Collaboration features
- Advanced export (editable formats)
- Asset management with CDN
- Variable font support
- Advanced pattern generation
