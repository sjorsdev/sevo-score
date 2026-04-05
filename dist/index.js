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
export { computeCyclePoints } from "./compute.js";
export { detectForkPoint, createForkFilter } from "./graph-reader.js";
export { POINTS } from "./points.js";
// Validation helpers
export { isValidNode, isValidAgentOutput, isValidGoal, NODE_TYPES, TYPE_TO_DIR, } from "./contracts.js";
