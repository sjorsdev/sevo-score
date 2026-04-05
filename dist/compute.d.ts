import type { SevoScoreBreakdown, SelectionNode } from "./types.js";
/** Counts of graph events, after fork filtering */
export interface EventCounts {
    agents: number;
    fitness: number;
    mutations: number;
    selections: number;
    noveltys: number;
    crossovers: number;
    seedImprovements: number;
    benchmarks: number;
}
/** Compute cycle points from event deltas and selections */
export declare function computeCyclePoints(current: EventCounts, previous: SevoScoreBreakdown | null, recentSelections: SelectionNode[]): {
    cyclePoints: number;
    agentsImproved: number;
    improvementBonus: number;
};
