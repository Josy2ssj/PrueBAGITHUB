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

### Real AI Integration (V1.1)

**The AI is REAL and functional.** Two providers are implemented:

1. **OpenAI** (GPT-4o, GPT-4, etc.)
2. **Anthropic** (Claude 3.5 Sonnet, Claude 3 Opus, etc.)

#### Configuration

Users configure their AI provider in the **Settings** panel:
- Select provider (OpenAI or Anthropic)
- Enter API key (stored locally in browser, never sent to our servers)
- Optionally specify model (defaults to gpt-4o or claude-3-5-sonnet)

The API key is stored in localStorage under `brand-studio-ai-config`.

#### How It Works

- All AI calls go directly from the browser to the provider's API
- No backend server required
- API keys are stored client-side only
- Users pay for their own API usage

#### Features Powered by AI

- **Logo Analysis**: Analyzes geometry, colors, complexity, symmetry
- **Color Generation**: Creates cohesive palettes based on brand brief
- **Typography Suggestions**: Recommends Google Font pairings
- **Pattern Concepts**: Generates pattern directions from brand identity
- **Photography Direction**: Defines subjects, lighting, mood, treatment
- **Creative Copilot**: Contextual chat that knows the entire project

#### Error Handling

When AI is not configured or fails:
- Clear error messages explain what's wrong
- Users are directed to Settings to configure their API key
- Manual workflows remain fully functional
- No fake/mock responses — honest about limitations

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

## Limitations (V1.1)

- No actual image generation for patterns/mockups (would need DALL-E, Midjourney, etc.)
- Export is UI-only (PDF/image export needs backend or client-side library)
- No real file upload to server (client-side only)
- Photography references are text-based (no actual image search)
- No collaborative features
- Logo analysis is text-based (would benefit from vision API for actual image analysis)

## What's Working

✅ **Real AI Integration** - OpenAI and Anthropic fully functional
✅ **Color Generation** - Real AI generates palettes based on brand brief
✅ **Typography Suggestions** - Real AI recommends Google Font pairings
✅ **Creative Copilot** - Real AI chat with full project context
✅ **Photography Direction** - Real AI defines photography guidelines
✅ **Pattern Concepts** - Real AI generates pattern directions
✅ **Logo Analysis** - Text-based analysis (would benefit from vision API)

## What Needs External Provider

- Real image generation (DALL-E, Midjourney, Stable Diffusion)
- Vision API for actual logo image analysis (currently text-based)
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
