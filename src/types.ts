// Canonical SEVO graph node types used by the scoring system.
// These are the source of truth — do not redefine in projects.

export interface SeVoNode {
  "@context": "sevo://v1";
  "@type": string;
  "@id": string;
  timestamp: string;
}

export interface AgentNode extends SeVoNode {
  "@type": "Agent";
  blueprint: string;
  parent?: string;
  generation: number;
  status: "active" | "testing" | "dormant" | "archived";
  domain?: string;
}

export interface FitnessNode extends SeVoNode {
  "@type": "Fitness";
  agent: string;
  eqs: number;
  accuracy: number;
  magnitude: number;
  branchesExplored: number;
  predictionError: number;
  cycleId: string;
  context: Record<string, unknown>;
}

export interface MutationNode extends SeVoNode {
  "@type": "Mutation";
  parent: string;
  proposal: string;
  branch: string;
  status: "proposed" | "testing" | "selected" | "rejected";
  reasoning: string;
}

export interface SelectionNode extends SeVoNode {
  "@type": "Selection";
  winner: string;
  loser: string;
  winnerEqs: number;
  loserEqs: number;
  reasoning: string;
  eqsDelta: number;
}

export interface BenchmarkNode extends SeVoNode {
  "@type": "Benchmark";
  version: number;
  parent?: string;
  task: string;
  scoringLogic: string;
  difficulty: number;
  passThreshold: number;
}

export interface SeedImprovementNode extends SeVoNode {
  "@type": "SeedImprovement";
  observation: string;
  suggestion: string;
  evidence: string[];
  priority: number;
}

export interface CrossoverNode extends SeVoNode {
  "@type": "Crossover";
  parent1: string;
  parent2: string;
  child: string;
  strategy: string;
  fitness: number;
}

export interface NoveltyNode extends SeVoNode {
  "@type": "Novelty";
  agent: string;
  behaviorSignature: string;
  noveltyScore: number;
  strategies: string[];
  testCount: number;
  uniquePatterns: string[];
}

export interface SevoScoreNode extends SeVoNode {
  "@type": "SevoScore";
  cycleId: string;
  score: number;
  cyclePoints: number;
  breakdown: SevoScoreBreakdown;
  metadata: SevoScoreMetadata;
}

export interface SevoScoreBreakdown {
  agentsCreated: number;
  agentsImproved: number;
  fitnessEvaluations: number;
  mutationsProposed: number;
  selectionsMade: number;
  noveltysRecorded: number;
  crossoversPerformed: number;
  seedImprovements: number;
  benchmarksEvolved: number;
  improvementBonus: number;
}

export interface SevoScoreMetadata {
  totalAgents: number;
  activeAgents: number;
  bestAgentId: string;
  bestEqs: number;
  avgFitness: number;
  maxBenchmarkDifficulty: number;
  evolvedLoc: number;
  model: string;
  domain: string;
  forkPoint?: string;
}
