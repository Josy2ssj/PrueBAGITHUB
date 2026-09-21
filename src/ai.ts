// AI Provider - Real API Integration
import type { Project } from './types';

export interface AIProvider {
  name: string;
  available: boolean;
  analyzeLogo(imageData: string): Promise<LogoAnalysisResult>;
  generateColors(brief: any, logoColors: string[]): Promise<ColorSuggestion[]>;
  suggestTypography(brief: any, brandPersonality: string[]): Promise<TypographySuggestion[]>;
  generatePatterns(project: Project): Promise<PatternSuggestion[]>;
  suggestPhotography(brief: any, colors: string[]): Promise<PhotographySuggestion>;
  chat(messages: { role: string; content: string }[], context: Project): Promise<string>;
  reviewDesign(element: any, context: Project): Promise<ReviewResult[]>;
}

export interface LogoAnalysisResult {
  geometry: string[];
  shapes: string[];
  angles: number[];
  colors: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  symmetry: 'symmetric' | 'asymmetric' | 'bilateral';
  suggestions: string[];
}

export interface ColorSuggestion {
  hex: string;
  role: string;
  reasoning: string;
}

export interface TypographySuggestion {
  family: string;
  role: string;
  reasoning: string;
  pairing: string;
}

export interface PatternSuggestion {
  name: string;
  direction: string;
  description: string;
  derivedFrom: string;
}

export interface PhotographySuggestion {
  subjects: string[];
  lighting: string;
  mood: string;
  treatment: string;
  references: string[];
}

export interface ReviewResult {
  type: 'issue' | 'principle' | 'recommendation';
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'none';
  apiKey: string;
  model: string;
}

// Get config from localStorage
export function getAIConfig(): AIConfig {
  const stored = localStorage.getItem('brand-studio-ai-config');
  if (stored) {
    return JSON.parse(stored);
  }
  return { provider: 'none', apiKey: '', model: '' };
}

export function setAIConfig(config: AIConfig) {
  localStorage.setItem('brand-studio-ai-config', JSON.stringify(config));
}

// OpenAI Provider
class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  available = true;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callAI(systemPrompt: string, userPrompt: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }

  async analyzeLogo(_imageData: string): Promise<LogoAnalysisResult> {
    const systemPrompt = `You are a professional brand designer analyzing a logo. Provide structured analysis in JSON format.`;
    const userPrompt = `Analyze this logo and return JSON with:
- geometry: array of geometric elements detected (e.g. ["circles", "curves", "negative-space"])
- shapes: array of shapes (e.g. ["circle", "arc", "triangle"])
- angles: array of key angles in degrees
- colors: array of hex colors detected
- complexity: "simple" | "moderate" | "complex"
- symmetry: "symmetric" | "asymmetric" | "bilateral"
- suggestions: array of 3-5 professional suggestions for logo improvement

Return ONLY valid JSON, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async generateColors(brief: any, logoColors: string[]): Promise<ColorSuggestion[]> {
    const systemPrompt = `You are a professional brand color expert. Generate a cohesive color palette based on brand strategy.`;
    const userPrompt = `Brand: ${brief?.product || 'Unknown'}
Industry: ${brief?.industry || 'General'}
Personality: ${brief?.personality?.join(', ') || 'Professional'}
Audience: ${brief?.audience || 'General'}
Logo colors: ${logoColors.join(', ')}

Generate a professional color palette with 6-7 colors. Return JSON array with objects:
- hex: color in hex format (e.g. "#2563EB")
- role: "primary" | "secondary" | "accent" | "neutral" | "background" | "surface" | "text"
- reasoning: brief explanation of why this color works

Return ONLY valid JSON array, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async suggestTypography(brief: any, personality: string[]): Promise<TypographySuggestion[]> {
    const systemPrompt = `You are a typography expert for brand identity. Suggest font pairings.`;
    const userPrompt = `Brand personality: ${personality.join(', ')}
Industry: ${brief?.industry || 'General'}
Tone: ${brief?.tone || 'Professional'}

Suggest 2 fonts (one for display/headings, one for body text) from Google Fonts. Return JSON array:
- family: font name (must be available on Google Fonts)
- role: "display" | "body"
- reasoning: why this font fits the brand
- pairing: what it pairs well with

Return ONLY valid JSON array, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async generatePatterns(project: Project): Promise<PatternSuggestion[]> {
    const systemPrompt = `You are a brand identity designer creating pattern concepts.`;
    const userPrompt = `Brand: ${project.name}
Industry: ${project.industry}
Brief: ${JSON.stringify(project.brief)}

Suggest 3 pattern directions derived from the brand identity. Return JSON array:
- name: pattern name
- direction: "geometric" | "organic" | "expressive"
- description: what the pattern looks like
- derivedFrom: which brand element it derives from

Return ONLY valid JSON array, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async suggestPhotography(brief: any, colors: string[]): Promise<PhotographySuggestion> {
    const systemPrompt = `You are an art director defining photography guidelines for a brand.`;
    const userPrompt = `Brand: ${brief?.product || 'Unknown'}
Personality: ${brief?.personality?.join(', ') || 'Professional'}
Colors: ${colors.join(', ')}

Define photography direction. Return JSON:
- subjects: array of 4 appropriate subjects
- lighting: lighting style description
- mood: overall mood description
- treatment: color treatment description
- references: array of 3 reference sources (magazines, brands, styles)

Return ONLY valid JSON, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async chat(messages: { role: string; content: string }[], context: Project): Promise<string> {
    const systemPrompt = `You are a creative AI assistant for brand identity design. You know everything about the current project:
- Brand: ${context.name}
- Industry: ${context.industry}
- Brief: ${JSON.stringify(context.brief)}
- Colors: ${context.colors ? context.colors.tokens.map(t => `${t.name}: ${t.hex}`).join(', ') : 'Not defined'}
- Typography: ${context.typography ? `${context.typography.display?.family || 'Not set'} / ${context.typography.body?.family || 'Not set'}` : 'Not defined'}
- Progress: ${Object.entries(context.progress).map(([k, v]) => `${k}: ${v}`).join(', ')}

Provide professional, specific, actionable advice. Be concise but insightful. Reference the actual brand context. Don't be generic.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async reviewDesign(element: any, _context: Project): Promise<ReviewResult[]> {
    const systemPrompt = `You are a design reviewer providing professional feedback.`;
    const userPrompt = `Review this design element: ${JSON.stringify(element)}

Provide 3 specific, actionable design issues or recommendations. Return JSON array:
- type: "issue" | "principle" | "recommendation"
- category: design category (e.g. "hierarchy", "contrast", "spacing")
- title: short title
- description: specific description of the issue
- severity: "low" | "medium" | "high"
- actionable: boolean

Return ONLY valid JSON array, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }
}

// Anthropic Provider
class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  available = true;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callAI(systemPrompt: string, userPrompt: string): Promise<any> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    const text = data.content[0].text;
    
    // Try to parse as JSON, otherwise return as string
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async analyzeLogo(_imageData: string): Promise<LogoAnalysisResult> {
    const systemPrompt = `You are a professional brand designer analyzing a logo. Provide structured analysis in JSON format.`;
    const userPrompt = `Analyze this logo and return JSON with:
- geometry: array of geometric elements detected
- shapes: array of shapes
- angles: array of key angles in degrees
- colors: array of hex colors detected
- complexity: "simple" | "moderate" | "complex"
- symmetry: "symmetric" | "asymmetric" | "bilateral"
- suggestions: array of 3-5 professional suggestions

Return ONLY valid JSON, no markdown.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async generateColors(brief: any, logoColors: string[]): Promise<ColorSuggestion[]> {
    const systemPrompt = `You are a professional brand color expert. Generate a cohesive color palette.`;
    const userPrompt = `Brand: ${brief?.product || 'Unknown'}
Industry: ${brief?.industry || 'General'}
Personality: ${brief?.personality?.join(', ') || 'Professional'}
Logo colors: ${logoColors.join(', ')}

Generate 6-7 colors. Return JSON array with:
- hex: color in hex
- role: "primary" | "secondary" | "accent" | "neutral" | "background" | "surface" | "text"
- reasoning: why this color works

Return ONLY valid JSON array.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async suggestTypography(brief: any, personality: string[]): Promise<TypographySuggestion[]> {
    const systemPrompt = `You are a typography expert for brand identity.`;
    const userPrompt = `Personality: ${personality.join(', ')}
Industry: ${brief?.industry || 'General'}

Suggest 2 Google Fonts. Return JSON array:
- family: font name
- role: "display" | "body"
- reasoning: why it fits
- pairing: what it pairs with

Return ONLY valid JSON array.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async generatePatterns(project: Project): Promise<PatternSuggestion[]> {
    const systemPrompt = `You are a brand identity designer creating pattern concepts.`;
    const userPrompt = `Brand: ${project.name}
Industry: ${project.industry}

Suggest 3 patterns. Return JSON array:
- name: pattern name
- direction: "geometric" | "organic" | "expressive"
- description: what it looks like
- derivedFrom: which brand element

Return ONLY valid JSON array.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async suggestPhotography(brief: any, colors: string[]): Promise<PhotographySuggestion> {
    const systemPrompt = `You are an art director defining photography guidelines.`;
    const userPrompt = `Brand: ${brief?.product || 'Unknown'}
Personality: ${brief?.personality?.join(', ') || 'Professional'}
Colors: ${colors.join(', ')}

Define photography direction. Return JSON:
- subjects: array of 4 subjects
- lighting: lighting style
- mood: overall mood
- treatment: color treatment
- references: array of 3 references

Return ONLY valid JSON.`;

    return await this.callAI(systemPrompt, userPrompt);
  }

  async chat(messages: { role: string; content: string }[], context: Project): Promise<string> {
    const systemPrompt = `You are a creative AI assistant for brand identity design. You know everything about the current project:
- Brand: ${context.name}
- Industry: ${context.industry}
- Brief: ${JSON.stringify(context.brief)}
- Colors: ${context.colors ? context.colors.tokens.map(t => `${t.name}: ${t.hex}`).join(', ') : 'Not defined'}
- Typography: ${context.typography ? `${context.typography.display?.family || 'Not set'} / ${context.typography.body?.family || 'Not set'}` : 'Not defined'}

Provide professional, specific, actionable advice. Be concise but insightful. Reference the actual brand context.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 500,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async reviewDesign(element: any, _context: Project): Promise<ReviewResult[]> {
    const systemPrompt = `You are a design reviewer.`;
    const userPrompt = `Review: ${JSON.stringify(element)}

Provide 3 issues. Return JSON array:
- type: "issue" | "principle" | "recommendation"
- category: design category
- title: short title
- description: specific description
- severity: "low" | "medium" | "high"
- actionable: boolean

Return ONLY valid JSON array.`;

    return await this.callAI(systemPrompt, userPrompt);
  }
}

// Provider factory
export function createAIProvider(config: AIConfig): AIProvider {
  if (config.provider === 'openai' && config.apiKey) {
    return new OpenAIProvider(config.apiKey, config.model || 'gpt-4o');
  }
  if (config.provider === 'anthropic' && config.apiKey) {
    return new AnthropicProvider(config.apiKey, config.model || 'claude-3-5-sonnet-20241022');
  }
  
  // No provider configured
  return {
    name: 'Not Configured',
    available: false,
    analyzeLogo: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    generateColors: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    suggestTypography: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    generatePatterns: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    suggestPhotography: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    chat: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
    reviewDesign: async () => { throw new Error('AI not configured. Please add your API key in Settings.'); },
  };
}

// Get current provider
export function getAIProvider(): AIProvider {
  const config = getAIConfig();
  return createAIProvider(config);
}

// Utility functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
