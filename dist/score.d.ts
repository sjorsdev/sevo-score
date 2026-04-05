import type { SevoScoreNode } from "./types.js";
import type { GraphReader, GitReader } from "./graph-reader.js";
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
export declare function computeSevoScore(input: ScoreInput, graph: GraphReader, git: GitReader): Promise<ScoreResult>;
