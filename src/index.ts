// sevo-score — canonical types, scoring, and contracts for SEVO projects
//
// Usage:
//   import { computeSevoScore, POINTS, type AgentRunner } from "sevo-score";
//
// This package is the single source of truth for:
// - Graph node types (AgentNode, FitnessNode, etc.)
// - Scoring formula and point values
// - Evolution system contracts (AgentRunner, Mutator, Selector, etc.)
// - Validation helpers
//
// Every SEVO project must use this package. Do not redefine these types.

// Scoring
export { computeSevoScore } from "./score.js";
export { computeCyclePoints, type EventCounts } from "./compute.js";
export { detectForkPoint, createForkFilter, type GraphReader, type GitReader } from "./graph-reader.js";
export { POINTS } from "./points.js";
export type { ScoreInput, ScoreResult } from "./score.js";

// Graph node types
export type {
  SeVoNode,
  AgentNode,
  FitnessNode,
  MutationNode,
  SelectionNode,
  BenchmarkNode,
  SeedImprovementNode,
  CrossoverNode,
  NoveltyNode,
  SevoScoreNode,
  SevoScoreBreakdown,
  SevoScoreMetadata,
} from "./types.js";

// Contracts — implement these to build a SEVO-compatible project
export type {
  AgentOutput,
  GraphWriter,
  GraphStore,
  AgentRunner,
  Mutator,
  Selector,
  Scorer,
  EvolutionCycle,
  Goal,
  NodeType,
} from "./contracts.js";

// Validation helpers
export {
  isValidNode,
  isValidAgentOutput,
  isValidGoal,
  NODE_TYPES,
  TYPE_TO_DIR,
} from "./contracts.js";
