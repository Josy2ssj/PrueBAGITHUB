// Brand Studio - Core Types

export type ApprovalStatus = 'DRAFT' | 'PROPOSED' | 'APPROVED';

export interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: number;
  updatedAt: number;
  logoAssetId?: string;
  brief?: BrandBrief;
  colors?: ColorSystem;
  typography?: TypographySystem;
  graphicSystem?: GraphicSystem;
  patterns?: Pattern[];
  photography?: PhotographyDirection;
  iconography?: IconSystem;
  applications?: Application[];
  presentation?: Presentation;
  progress: ModuleProgress;
}

export interface ModuleProgress {
  logo: 'pending' | 'working' | 'approved';
  color: 'pending' | 'working' | 'approved';
  type: 'pending' | 'working' | 'approved';
  graphics: 'pending' | 'working' | 'approved';
  photo: 'pending' | 'working' | 'approved';
  icons: 'pending' | 'working' | 'approved';
}

export interface BrandBrief {
  product: string;
  audience: string;
  personality: string[];
  attributes: string[];
  positioning: string;
  tone: string;
  competitors: string[];
  references: string[];
  avoid: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'image' | 'generated' | 'reference' | 'pattern' | 'icon' | 'mockup' | 'export';
  origin: 'SOURCE' | 'AI_GENERATED' | 'DERIVED';
  url: string;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

export interface LogoAnalysis {
  assetId: string;
  geometry: string[];
  proportions: { width: number; height: number; ratio: number };
  symmetry: 'symmetric' | 'asymmetric' | 'bilateral';
  complexity: 'simple' | 'moderate' | 'complex';
  minSize: number;
  clearSpace: number;
  variants: LogoVariant[];
  detectedColors: string[];
  detectedShapes: string[];
  detectedAngles: number[];
}

export interface LogoVariant {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'isotype' | 'wordmark' | 'favicon';
  status: ApprovalStatus;
}

export interface ColorToken {
  id: string;
  name: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'background' | 'surface' | 'text';
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  status: ApprovalStatus;
}

export interface ColorSystem {
  tokens: ColorToken[];
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'split-complementary' | 'triadic';
  temperature: 'warm' | 'cool' | 'neutral';
  contrastMatrix?: ContrastResult[];
}

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
}

export interface TypographySystem {
  display?: FontConfig;
  heading?: FontConfig;
  body?: FontConfig;
  mono?: FontConfig;
  scale: TypeScale;
  status: ApprovalStatus;
}

export interface FontConfig {
  family: string;
  weight: number;
  style: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface TypeScale {
  base: number;
  ratio: number;
  levels: { name: string; size: number; lineHeight: number; weight: number }[];
}

export interface GraphicSystem {
  direction: 'geometric' | 'organic' | 'expressive';
  elements: GraphicElement[];
  status: ApprovalStatus;
}

export interface GraphicElement {
  id: string;
  type: string;
  svg: string;
  description: string;
}

export interface Pattern {
  id: string;
  name: string;
  svg: string;
  scale: number;
  spacing: number;
  rotation: number;
  colors: string[];
  status: ApprovalStatus;
}

export interface PhotographyDirection {
  subjects: string[];
  framing: string;
  lighting: string;
  temperature: string;
  treatment: string;
  moodboard: string[];
  status: ApprovalStatus;
}

export interface IconSystem {
  style: 'outline' | 'filled';
  stroke: number;
  radius: number;
  grid: number;
  status: ApprovalStatus;
}

export interface Application {
  id: string;
  name: string;
  type: string;
  preview: string;
  status: ApprovalStatus;
}

export interface Presentation {
  style: 'editorial' | 'minimal' | 'experimental';
  sections: PresentationSection[];
  status: ApprovalStatus;
}

export interface PresentationSection {
  id: string;
  type: 'cover' | 'concept' | 'logo' | 'color' | 'typography' | 'graphics' | 'patterns' | 'photography' | 'applications' | 'closing';
  title: string;
  content: any;
  order: number;
}

export interface DesignRule {
  id: string;
  category: string;
  type: 'verified' | 'principle' | 'recommendation' | 'issue';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface AIProposal {
  id: string;
  module: string;
  action: 'analyze' | 'suggest' | 'generate' | 'apply' | 'regenerate';
  content: any;
  reasoning: string;
  timestamp: number;
}

export interface Dependency {
  source: string;
  target: string;
  description: string;
}
