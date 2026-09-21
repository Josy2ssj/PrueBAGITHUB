// AI Provider Architecture - Abstracted from specific providers
import type { Project, ColorToken, TypographySystem, Pattern, PhotographyDirection } from './types';

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

// Mock Provider - clearly identified as development/demo
export class MockAIProvider implements AIProvider {
  name = 'Brand Studio AI (Demo)';
  available = true;

  async analyzeLogo(_imageData: string): Promise<LogoAnalysisResult> {
    await delay(1500);
    return {
      geometry: ['circles', 'curves', 'negative-space'],
      shapes: ['circle', 'arc', 'triangle'],
      angles: [0, 45, 90, 180],
      colors: ['#2563EB', '#1E40AF', '#60A5FA'],
      complexity: 'moderate',
      symmetry: 'bilateral',
      suggestions: [
        'Consider creating a simplified icon variant for favicon use.',
        'The negative space in the center could be emphasized as a brand element.',
        'At 24px, the inner details may merge. Test reduction carefully.',
      ],
    };
  }

  async generateColors(brief: any, logoColors: string[]): Promise<ColorSuggestion[]> {
    await delay(1200);
    const personality = brief?.personality?.[0] || 'professional';
    const base = logoColors[0] || '#2563EB';
    
    if (personality === 'playful' || personality === 'creative') {
      return [
        { hex: base, role: 'primary', reasoning: 'Extracted from your logo — anchors the identity.' },
        { hex: '#F59E0B', role: 'accent', reasoning: 'Warm accent creates energy and draws attention to CTAs.' },
        { hex: '#F8FAFC', role: 'background', reasoning: 'Near-white background keeps focus on content.' },
        { hex: '#1E293B', role: 'text', reasoning: 'Deep slate for comfortable reading without harsh black.' },
        { hex: '#E2E8F0', role: 'surface', reasoning: 'Subtle surface color for cards and elevated elements.' },
        { hex: '#64748B', role: 'neutral', reasoning: 'Mid-tone for secondary text and borders.' },
      ];
    }
    return [
      { hex: base, role: 'primary', reasoning: 'Extracted from your logo — anchors the identity.' },
      { hex: adjustBrightness(base, -20), role: 'secondary', reasoning: 'Darker variant for depth and hover states.' },
      { hex: '#F97316', role: 'accent', reasoning: 'Complementary warm tone creates visual interest without competing.' },
      { hex: '#FAFAFA', role: 'background', reasoning: 'Clean background that lets your brand color breathe.' },
      { hex: '#18181B', role: 'text', reasoning: 'Near-black for maximum readability.' },
      { hex: '#F4F4F5', role: 'surface', reasoning: 'Subtle surface for cards and containers.' },
      { hex: '#71717A', role: 'neutral', reasoning: 'Balanced neutral for supporting elements.' },
    ];
  }

  async suggestTypography(brief: any, _personality: string[]): Promise<TypographySuggestion[]> {
    await delay(1000);
    const industry = brief?.industry || 'general';
    
    const directions: Record<string, TypographySuggestion[]> = {
      technology: [
        { family: 'Inter', role: 'body', reasoning: 'Highly legible, modern, designed for screens.', pairing: 'Space Grotesk' },
        { family: 'Space Grotesk', role: 'display', reasoning: 'Geometric personality complements tech brands.', pairing: 'Inter' },
      ],
      luxury: [
        { family: 'Playfair Display', role: 'display', reasoning: 'Elegant serifs communicate premium positioning.', pairing: 'Lato' },
        { family: 'Lato', role: 'body', reasoning: 'Clean sans-serif that lets display type shine.', pairing: 'Playfair Display' },
      ],
      default: [
        { family: 'DM Sans', role: 'body', reasoning: 'Friendly yet professional, excellent screen legibility.', pairing: 'DM Serif Display' },
        { family: 'DM Serif Display', role: 'display', reasoning: 'Distinctive character without being decorative.', pairing: 'DM Sans' },
      ],
    };

    return directions[industry] || directions.default;
  }

  async generatePatterns(project: Project): Promise<PatternSuggestion[]> {
    await delay(1200);
    return [
      { name: 'Geometric Grid', direction: 'geometric', description: 'Repeating modular units derived from logo geometry.', derivedFrom: 'Logo proportions and angles' },
      { name: 'Flow Lines', direction: 'organic', description: 'Curved lines inspired by the logo\'s arc elements.', derivedFrom: 'Logo curves and negative space' },
      { name: 'Signal Marks', direction: 'expressive', description: 'Bold graphic marks that can be placed strategically.', derivedFrom: 'Logo iconography and shapes' },
    ];
  }

  async suggestPhotography(brief: any, colors: string[]): Promise<PhotographySuggestion> {
    await delay(1000);
    return {
      subjects: ['Product in context', 'People interacting', 'Details and textures', 'Architecture and spaces'],
      lighting: 'Natural, soft directional light. Avoid harsh flash.',
      mood: 'Authentic, considered, slightly aspirational.',
      treatment: `Slight desaturation with ${colors[0] || 'brand color'} color cast in shadows.`,
      references: ['Kinfolk magazine', 'Aesop campaigns', 'Muji visual language'],
    };
  }

  async chat(messages: { role: string; content: string }[], context: Project): Promise<string> {
    await delay(800);
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (lastMessage.includes('color') || lastMessage.includes('palette')) {
      return `Looking at ${context.name}'s current palette, I notice the primary and secondary colors have similar visual weight. Consider using the secondary at reduced opacity or saturation to create clearer hierarchy. The accent color is working well as a call-to-action driver.`;
    }
    if (lastMessage.includes('typography') || lastMessage.includes('font')) {
      return `Your current type system has good contrast between display and body. One consideration: the line-height on body text could increase slightly to 1.6 for better readability in longer passages. The letter-spacing on your display font is appropriate for its use.`;
    }
    if (lastMessage.includes('logo')) {
      return `The logo analysis shows good geometric foundations. The bilateral symmetry provides stability. I'd recommend testing it at 16px to ensure the key identifying feature remains visible. Consider whether you need a monochrome version for single-color applications.`;
    }
    return `I've reviewed the current state of ${context.name}. The identity is developing coherently. The main areas to focus on next are establishing the graphic system and ensuring all applications maintain consistency. Would you like me to analyze any specific element in more detail?`;
  }

  async reviewDesign(element: any, _context: Project): Promise<ReviewResult[]> {
    await delay(1000);
    return [
      { type: 'principle', category: 'hierarchy', title: 'Visual Weight', description: 'Consider increasing the size difference between primary and secondary elements to strengthen hierarchy.', severity: 'medium', actionable: true },
      { type: 'recommendation', category: 'spacing', title: 'Grouping', description: 'Elements that belong together could be closer. Current spacing doesn\'t clearly communicate relationships.', severity: 'low', actionable: true },
      { type: 'issue', category: 'contrast', title: 'Text Readability', description: 'This text-background combination may not meet WCAG AA for normal text sizes.', severity: 'high', actionable: true },
    ];
  }
}

// Provider registry
let currentProvider: AIProvider = new MockAIProvider();

export function getAIProvider(): AIProvider {
  return currentProvider;
}

export function setAIProvider(provider: AIProvider) {
  currentProvider = provider;
}

// Utility functions
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// Color utility functions
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
