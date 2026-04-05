// Canonical point values for SevoScore.
// These are the ONLY source of truth for scoring weights.
export const POINTS = {
    agentCreated: 1,
    fitnessEvaluated: 1,
    mutationProposed: 1,
    selectionMade: 1,
    noveltyRecorded: 1,
    crossoverPerformed: 2,
    seedImprovement: 2,
    benchmarkEvolved: 3,
    improvementMultiplier: 10, // eqsDelta × this
};
