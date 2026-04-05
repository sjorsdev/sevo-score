// Main scoring function — orchestrates graph reading, fork detection, and scoring.

import type {
  AgentNode,
  FitnessNode,
  MutationNode,
  SelectionNode,
  NoveltyNode,
  CrossoverNode,
  SeedImprovementNode,
  BenchmarkNode,
  SevoScoreNode,
  SevoScoreMetadata,
} from "./types.js";
import type { GraphReader, GitReader } from "./graph-reader.js";
import { detectForkPoint, createForkFilter } from "./graph-reader.js";
import { computeCyclePoints, type EventCounts } from "./compute.js";

export interface ScoreInput {
  cycleId: string;
  bestAgentId: string;
  bestEqs: number;
  avgFitness: number;
}

export interface ScoreResult {
  node: SevoScoreNode;
  forkPoint: string | null;
  isNewProject: boolean;
}

/**
 * Compute SevoScore for a completed evolution cycle.
 *
 * This is the canonical scoring implementation. All SEVO projects
 * must use this function (via @anthropic-sevo/score) to ensure
 * consistent, verifiable scoring across the ecosystem.
 */
export async function computeSevoScore(
  input: ScoreInput,
  graph: GraphReader,
  git: GitReader,
): Promise<ScoreResult> {
  // Detect fork point
  const forkPoint = await detectForkPoint(git);
  const afterFork = createForkFilter(forkPoint);

  // Read and filter all graph data
  const allFitness = (await graph.readNodes<FitnessNode>("fitness"))
    .filter((n) => n.cycleId === input.cycleId)
    .filter(afterFork);
  const allMutations = (await graph.readNodes<MutationNode>("mutation")).filter(afterFork);
  const allSelections = (await graph.readNodes<SelectionNode>("selection")).filter(afterFork);
  const allNoveltys = (await graph.readNodes<NoveltyNode>("novelty")).filter(afterFork);
  const allCrossovers = (await graph.readNodes<CrossoverNode>("crossover")).filter(afterFork);
  const allSeedImprovements = (await graph.readNodes<SeedImprovementNode>("seedimprovement")).filter(afterFork);
  const allBenchmarks = (await graph.readNodes<BenchmarkNode>("benchmark")).filter(afterFork);
  const allAgents = (await graph.readNodes<AgentNode>("agent")).filter(afterFork);
  const activeAgents = allAgents.filter((a) => a.status === "active");

  // Find valid previous score (fork-aware)
  const allPreviousScores = await graph.readNodes<SevoScoreNode>("sevoscore");
  let latestPrevious: SevoScoreNode | null = null;
  if (forkPoint) {
    const forkAware = allPreviousScores.filter(
      (s) => s.metadata.forkPoint === forkPoint
    );
    latestPrevious = forkAware.length > 0
      ? forkAware.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
      : null;
  } else {
    latestPrevious = allPreviousScores.length > 0
      ? allPreviousScores.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
      : null;
  }

  const previousTotal = latestPrevious?.score ?? 0;
  const prevBreakdown = latestPrevious?.breakdown ?? null;

  // Count current events
  const counts: EventCounts = {
    agents: allAgents.length,
    fitness: allFitness.length,
    mutations: allMutations.length,
    selections: allSelections.length,
    noveltys: allNoveltys.length,
    crossovers: allCrossovers.length,
    seedImprovements: allSeedImprovements.length,
    benchmarks: allBenchmarks.length,
  };

  // Sort selections by timestamp for cycle delta calculation
  const sortedSelections = allSelections
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Compute cycle points (pure logic, no I/O)
  const { cyclePoints, agentsImproved, improvementBonus } =
    computeCyclePoints(counts, prevBreakdown, sortedSelections);

  const cumulativeScore = previousTotal + cyclePoints;

  const maxDifficulty = allBenchmarks.length > 0
    ? Math.max(...allBenchmarks.map((b) => b.difficulty))
    : 0;

  const evolvedLoc = await graph.countLoc("./blueprints");

  const goalData = await graph.readJson<{ name?: string }>("./goal.jsonld");
  const domain = goalData?.name ?? "unknown";

  const metadata: SevoScoreMetadata = {
    totalAgents: allAgents.length,
    activeAgents: activeAgents.length,
    bestAgentId: input.bestAgentId,
    bestEqs: input.bestEqs,
    avgFitness: input.avgFitness,
    maxBenchmarkDifficulty: maxDifficulty,
    evolvedLoc,
    model: "claude-haiku-4-5",
    domain,
    ...(forkPoint ? { forkPoint } : {}),
  };

  const node: SevoScoreNode = {
    "@context": "sevo://v1",
    "@type": "SevoScore",
    "@id": `sevoscore-${input.cycleId}`,
    timestamp: new Date().toISOString(),
    cycleId: input.cycleId,
    score: cumulativeScore,
    cyclePoints,
    breakdown: {
      agentsCreated: allAgents.length,
      agentsImproved,
      fitnessEvaluations: allFitness.length,
      mutationsProposed: allMutations.length,
      selectionsMade: allSelections.length,
      noveltysRecorded: allNoveltys.length,
      crossoversPerformed: allCrossovers.length,
      seedImprovements: allSeedImprovements.length,
      benchmarksEvolved: allBenchmarks.length,
      improvementBonus,
    },
    metadata,
  };

  return {
    node,
    forkPoint,
    isNewProject: latestPrevious === null,
  };
}
