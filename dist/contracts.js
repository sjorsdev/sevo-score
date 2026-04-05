// Evolution system contracts.
// Implement these interfaces to build a SEVO-compatible project.
// The scoring system uses these to verify ecosystem compatibility.
// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
/** Validate that a node has all required SeVoNode fields */
export function isValidNode(node) {
    if (typeof node !== "object" || node === null)
        return false;
    const n = node;
    return (n["@context"] === "sevo://v1" &&
        typeof n["@type"] === "string" &&
        typeof n["@id"] === "string" &&
        typeof n.timestamp === "string");
}
/** Validate that agent output conforms to the contract */
export function isValidAgentOutput(output) {
    if (typeof output !== "object" || output === null)
        return false;
    const o = output;
    return (typeof o.fitness === "number" &&
        o.fitness >= 0 &&
        o.fitness <= 1 &&
        typeof o.branches === "number" &&
        o.branches >= 1);
}
/** Validate that a goal.jsonld conforms to the contract */
export function isValidGoal(goal) {
    if (typeof goal !== "object" || goal === null)
        return false;
    const g = goal;
    return (g["@context"] === "sevo://v1" &&
        g["@type"] === "Goal" &&
        typeof g["@id"] === "string" &&
        typeof g.name === "string" &&
        typeof g.metric === "string" &&
        typeof g.timestamp === "string");
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
];
/** Map from node @type to its graph directory name */
export const TYPE_TO_DIR = {
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
