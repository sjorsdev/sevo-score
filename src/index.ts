// @anthropic-sevo/score — canonical scoring for SEVO evolution projects
//
// Usage:
//   import { computeSevoScore, POINTS } from "@anthropic-sevo/score";
//
// Every SEVO project must use this package for scoring.
// Do not reimplement the scoring logic.

export { computeSevoScore } from "./score.js";
export { computeCyclePoints, type EventCounts } from "./compute.js";
export { detectForkPoint, createForkFilter, type GraphReader, type GitReader } from "./graph-reader.js";
export { POINTS } from "./points.js";
export type { ScoreInput, ScoreResult } from "./score.js";
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
