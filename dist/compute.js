// Pure scoring logic — no I/O. Takes counted events, returns score.
import { POINTS } from "./points.js";
/** Compute cycle points from event deltas and selections */
export function computeCyclePoints(current, previous, recentSelections) {
    // Cycle deltas (new events since last score)
    const cycleMutations = previous ? current.mutations - previous.mutationsProposed : current.mutations;
    const cycleSelections = previous ? current.selections - previous.selectionsMade : current.selections;
    const cycleNoveltys = previous ? current.noveltys - previous.noveltysRecorded : current.noveltys;
    const cycleCrossovers = previous ? current.crossovers - previous.crossoversPerformed : current.crossovers;
    const cycleSeedImprovements = previous ? current.seedImprovements - previous.seedImprovements : current.seedImprovements;
    const cycleBenchmarks = previous ? current.benchmarks - previous.benchmarksEvolved : current.benchmarks;
    const cycleAgents = previous ? current.agents - previous.agentsCreated : current.agents;
    // Improvement bonus from winning selections
    let improvementBonus = 0;
    let agentsImproved = 0;
    // Take only the most recent selections matching the cycle delta count
    const cycleSelectionNodes = recentSelections.slice(0, Math.max(cycleSelections, 0));
    for (const sel of cycleSelectionNodes) {
        if (sel.eqsDelta > 0) {
            agentsImproved++;
            improvementBonus += sel.eqsDelta * POINTS.improvementMultiplier;
        }
    }
    let cyclePoints = 0;
    cyclePoints += Math.max(cycleAgents, 0) * POINTS.agentCreated;
    cyclePoints += improvementBonus;
    cyclePoints += current.fitness * POINTS.fitnessEvaluated; // fitness is already cycle-scoped
    cyclePoints += Math.max(cycleMutations, 0) * POINTS.mutationProposed;
    cyclePoints += Math.max(cycleSelections, 0) * POINTS.selectionMade;
    cyclePoints += Math.max(cycleNoveltys, 0) * POINTS.noveltyRecorded;
    cyclePoints += Math.max(cycleCrossovers, 0) * POINTS.crossoverPerformed;
    cyclePoints += Math.max(cycleSeedImprovements, 0) * POINTS.seedImprovement;
    cyclePoints += Math.max(cycleBenchmarks, 0) * POINTS.benchmarkEvolved;
    return { cyclePoints, agentsImproved, improvementBonus };
}
