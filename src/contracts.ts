// Evolution system contracts.
// Implement these interfaces to build a SEVO-compatible project.
// The scoring system uses these to verify ecosystem compatibility.

import type {
  SeVoNode,
  AgentNode,
  FitnessNode,
  MutationNode,
  SelectionNode,
  BenchmarkNode,
  SevoScoreNode,
} from "./types.js";

// ---------------------------------------------------------------------------
// Agent output contract — what a blueprint must print to stdout
// ---------------------------------------------------------------------------

/** The JSON that every agent blueprint must output as its last line of stdout */
export interface AgentOutput {
  /** Overall fitness score, 0-1 */
  fitness: number;
  /** Number of branches/variants explored during evaluation */
  branches: number;
  /** Number of tests/checks that passed */
  correct?: number;
  /** Total number of tests/checks */
  total?: number;
  /** Domain-specific fields are allowed */
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Graph store contract — how to persist evolution data
// ---------------------------------------------------------------------------

/** Interface for writing graph nodes. Append-only — never overwrite. */
export interface GraphWriter {
  /** Write a node to the graph. Must fail if node @id already exists. */
  writeNode(node: SeVoNode): Promise<string>;

  /** Archive a node (create archived copy, never delete original) */
  archiveNode(id: string, reason: string): Promise<void>;
}

/** Full graph store — read + write */
export interface GraphStore {
  /** Read all nodes of a type, optionally filtered */
  queryNodes<T extends SeVoNode>(
    type: string,
    filter?: (node: T) => boolean,
  ): Promise<T[]>;

  /** Read a single node by @id */
  readNode<T extends SeVoNode>(id: string): Promise<T>;

  /** Write a new node (must fail if @id exists — append-only) */
  writeNode(node: SeVoNode): Promise<string>;

  /** Archive a node (never delete) */
  archiveNode(id: string, reason: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Evolution component contracts
// ---------------------------------------------------------------------------

/** Run an agent blueprint in a sandbox and capture output */
export interface AgentRunner {
  run(
    blueprint: string,
    timeoutMs?: number,
  ): Promise<{
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
    /** Parsed from last line of stdout if valid JSON */
    output?: AgentOutput;
  }>;
}

/** Propose a mutation to an agent's blueprint */
export interface Mutator {
  propose(
    agent: AgentNode,
    benchmark: BenchmarkNode,
    fitnessHistory: FitnessNode[],
  ): Promise<MutationNode>;
}

/** Select a winner between parent and mutant */
export interface Selector {
  select(
    parentId: string,
    mutantId: string,
    parentFitness: FitnessNode,
    mutantFitness: FitnessNode,
  ): Promise<SelectionNode>;
}

/** Score an agent's execution result */
export interface Scorer {
  score(
    agentId: string,
    output: AgentOutput,
    cycleId: string,
    parentPrediction?: { eqs: number },
  ): Promise<FitnessNode>;
}

// ---------------------------------------------------------------------------
// Evolution loop contract — the full cycle
// ---------------------------------------------------------------------------

/** A single evolution cycle: benchmark → mutate → test → select → score */
export interface EvolutionCycle {
  /** Run one full cycle and return the score */
  runCycle(cycleId: string): Promise<SevoScoreNode>;
}

// ---------------------------------------------------------------------------
// Goal contract — what defines a project's objective
// ---------------------------------------------------------------------------

/** The goal.jsonld structure that every SEVO project must have */
export interface Goal {
  "@context": "sevo://v1";
  "@type": "Goal";
  "@id": string;
  name: string;
  /** How agents are scored — human-readable description */
  metric: string;
  /** Optional multi-goal configuration */
  goals?: Array<{
    name: string;
    description: string;
    metric: string;
    evolvable?: string[];
  }>;
  /** Formula combining multiple goals into single fitness, e.g. "0.5 * a + 0.3 * b + 0.2 * c" */
  composite_fitness?: string;
  note?: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/** Validate that a node has all required SeVoNode fields */
export function isValidNode(node: unknown): node is SeVoNode {
  if (typeof node !== "object" || node === null) return false;
  const n = node as Record<string, unknown>;
  return (
    n["@context"] === "sevo://v1" &&
    typeof n["@type"] === "string" &&
    typeof n["@id"] === "string" &&
    typeof n.timestamp === "string"
  );
}

/** Validate that agent output conforms to the contract */
export function isValidAgentOutput(output: unknown): output is AgentOutput {
  if (typeof output !== "object" || output === null) return false;
  const o = output as Record<string, unknown>;
  return (
    typeof o.fitness === "number" &&
    o.fitness >= 0 &&
    o.fitness <= 1 &&
    typeof o.branches === "number" &&
    o.branches >= 1
  );
}

/** Validate that a goal.jsonld conforms to the contract */
export function isValidGoal(goal: unknown): goal is Goal {
  if (typeof goal !== "object" || goal === null) return false;
  const g = goal as Record<string, unknown>;
  return (
    g["@context"] === "sevo://v1" &&
    g["@type"] === "Goal" &&
    typeof g["@id"] === "string" &&
    typeof g.name === "string" &&
    typeof g.metric === "string" &&
    typeof g.timestamp === "string"
  );
}

/** All valid node @type values in the SEVO ecosystem */
export const NODE_TYPES = [
  "Agent",
  "Fitness",
  "Mutation",
  "Selection",
  "Benchmark",
  "SeedImprovement",
  "Crossover",
  "Novelty",
  "Island",
  "EvolutionStrategy",
  "SevoScore",
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

/** Map from node @type to its graph directory name */
export const TYPE_TO_DIR: Record<NodeType, string> = {
  Agent: "agents",
  Fitness: "fitnesss",
  Mutation: "mutations",
  Selection: "selections",
  Benchmark: "benchmarks",
  SeedImprovement: "seedimprovements",
  Crossover: "crossovers",
  Novelty: "noveltys",
  Island: "islands",
  EvolutionStrategy: "evolutionstrategys",
  SevoScore: "sevoscores",
};
