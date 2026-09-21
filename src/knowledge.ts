// Design Knowledge Base - Professional design rules and principles
import type { DesignRule } from './types';

export const knowledgeBase: DesignRule[] = [
  // Logo Rules
  { id: 'logo-1', category: 'logo', type: 'verified', title: 'Minimum Size', description: 'Logo must remain legible at 24px height minimum for digital use.', severity: 'high', actionable: true },
  { id: 'logo-2', category: 'logo', type: 'principle', title: 'Clear Space', description: 'Maintain clear space equal to the height of a key logo element around all sides.', severity: 'medium', actionable: true },
  { id: 'logo-3', category: 'logo', type: 'verified', title: 'Contrast on Backgrounds', description: 'Logo must maintain 3:1 contrast ratio against all intended background colors.', severity: 'high', actionable: true },
  { id: 'logo-4', category: 'logo', type: 'principle', title: 'Simplicity', description: 'Simpler logos are more memorable and reproduce better across media.', severity: 'medium', actionable: false },
  { id: 'logo-5', category: 'logo', type: 'issue', title: 'Complexity at Scale', description: 'Complex details may disappear at small sizes. Consider a simplified variant.', severity: 'medium', actionable: true },

  // Color Rules
  { id: 'color-1', category: 'color', type: 'verified', title: 'WCAG AA Text Contrast', description: 'Body text requires minimum 4.5:1 contrast ratio against its background.', severity: 'high', actionable: true },
  { id: 'color-2', category: 'color', type: 'verified', title: 'WCAG AA Large Text', description: 'Large text (18px+ or 14px bold+) requires minimum 3:1 contrast ratio.', severity: 'high', actionable: true },
  { id: 'color-3', category: 'color', type: 'principle', title: '60/30/10 Distribution', description: 'Consider distributing colors: 60% dominant, 30% secondary, 10% accent for visual balance.', severity: 'low', actionable: true },
  { id: 'color-4', category: 'color', type: 'principle', title: 'Color Redundancy', description: 'Avoid using color as the sole differentiator. Combine with shape, texture, or labels.', severity: 'medium', actionable: true },
  { id: 'color-5', category: 'color', type: 'recommendation', title: 'Temperature Consistency', description: 'A cohesive palette typically maintains consistent warm or cool temperature across related hues.', severity: 'low', actionable: false },

  // Typography Rules
  { id: 'type-1', category: 'typography', type: 'verified', title: 'Minimum Body Size', description: 'Body text should not be smaller than 16px for comfortable reading on screens.', severity: 'high', actionable: true },
  { id: 'type-2', category: 'typography', type: 'principle', title: 'Line Length', description: 'Optimal reading line length is 45-75 characters per line.', severity: 'medium', actionable: true },
  { id: 'type-3', category: 'typography', type: 'principle', title: 'Type Contrast', description: 'Pairing fonts with sufficient contrast (serif + sans, weight difference) creates hierarchy.', severity: 'medium', actionable: false },
  { id: 'type-4', category: 'typography', type: 'verified', title: 'Modular Scale', description: 'Using a consistent ratio (1.2, 1.25, 1.333, 1.5) creates harmonious size relationships.', severity: 'low', actionable: true },
  { id: 'type-5', category: 'typography', type: 'principle', title: 'Vertical Rhythm', description: 'Consistent line-height multiples create visual rhythm across the page.', severity: 'low', actionable: true },

  // Composition Rules
  { id: 'comp-1', category: 'composition', type: 'principle', title: 'Visual Hierarchy', description: 'One element should dominate. Secondary elements support. Tertiary elements recede.', severity: 'high', actionable: false },
  { id: 'comp-2', category: 'composition', type: 'principle', title: 'Proximity', description: 'Related elements should be grouped together. Unrelated elements separated.', severity: 'high', actionable: true },
  { id: 'comp-3', category: 'composition', type: 'principle', title: 'Alignment', description: 'Every element should have a visual connection to something else on the page.', severity: 'high', actionable: true },
  { id: 'comp-4', category: 'composition', type: 'principle', title: 'Repetition', description: 'Repeat visual elements (colors, shapes, textures) to unify the design.', severity: 'medium', actionable: false },
  { id: 'comp-5', category: 'composition', type: 'principle', title: 'White Space', description: 'Generous spacing communicates premium quality and improves readability.', severity: 'medium', actionable: true },

  // Pattern Rules
  { id: 'pattern-1', category: 'graphics', type: 'principle', title: 'Derived from Identity', description: 'Patterns should derive from logo geometry, not be arbitrary decoration.', severity: 'high', actionable: false },
  { id: 'pattern-2', category: 'graphics', type: 'principle', title: 'Density Variation', description: 'Patterns should work at multiple densities without losing their character.', severity: 'medium', actionable: true },
  { id: 'pattern-3', category: 'graphics', type: 'principle', title: 'Subtlety', description: 'Brand patterns should support content, not compete with it.', severity: 'medium', actionable: false },

  // Photography Rules
  { id: 'photo-1', category: 'photography', type: 'principle', title: 'Consistent Treatment', description: 'All brand photography should share consistent color treatment, lighting, and mood.', severity: 'high', actionable: false },
  { id: 'photo-2', category: 'photography', type: 'principle', title: 'Subject Clarity', description: 'Photography direction should clearly define what subjects are appropriate.', severity: 'medium', actionable: false },
  { id: 'photo-3', category: 'photography', type: 'principle', title: 'Depth & Layering', description: 'Consider foreground, midground, and background for visual interest.', severity: 'low', actionable: false },
];

export function getRulesByCategory(category: string): DesignRule[] {
  return knowledgeBase.filter((r) => r.category === category);
}

export function getRulesByType(type: DesignRule['type']): DesignRule[] {
  return knowledgeBase.filter((r) => r.type === type);
}

export function getActionableIssues(category?: string): DesignRule[] {
  return knowledgeBase.filter(
    (r) => r.actionable && (r.type === 'issue' || r.type === 'verified') && (!category || r.category === category)
  );
}
