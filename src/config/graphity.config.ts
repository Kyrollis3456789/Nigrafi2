/**
 * Graphity Configuration Specification
 *
 * Defines the configuration targets and settings for Home Screen and Graph Screen modes.
 */

export interface GraphityConfig {
  id: string;
  windowTarget: string;
  autoOpenSection: string;
  polarity: string;
  maxFileLabel: string;
  saveTarget: string;
}

export const HOME_SCREEN_CONFIG: GraphityConfig = {
  id: 'home-screen',
  windowTarget: 'Home Screen / Dashboard',
  autoOpenSection: 'General',
  polarity: 'Home Screen Polarity',
  maxFileLabel: 'Graphity_Home_Config',
  saveTarget: 'Same Configuration Save (Original)',
};

export const GRAPH_SCREEN_CONFIG: GraphityConfig = {
  id: 'graph-screen',
  windowTarget: 'Graph Screen',
  autoOpenSection: 'NGRAFY / S-O-P-A-P',
  polarity: 'Original Polarity',
  maxFileLabel: 'Graphity_Graph_Config',
  saveTarget: 'Same Configuration Save (Original)',
};

export const GRAPHITY_CONFIGS: Record<string, GraphityConfig> = {
  home: HOME_SCREEN_CONFIG,
  graph: GRAPH_SCREEN_CONFIG,
};
