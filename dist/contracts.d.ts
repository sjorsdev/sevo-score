import type { SeVoNode, AgentNode, FitnessNode, MutationNode, SelectionNode, BenchmarkNode, SevoScoreNode } from "./types.js";
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
    queryNodes<T extends SeVoNode>(type: string, filter?: (node: T) => boolean): Promise<T[]>;
    /** Read a single node by @id */
    readNode<T extends SeVoNode>(id: string): Promise<T>;
    /** Write a new node (must fail if @id exists — append-only) */
    writeNode(node: SeVoNode): Promise<string>;
    /** Archive a node (never delete) */
    archiveNode(id: string, reason: string): Promise<void>;
}
/** Run an agent blueprint in a sandbox and capture output */
export interface AgentRunner {
    run(blueprint: string, timeoutMs?: number): Promise<{
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
    propose(agent: AgentNode, benchmark: BenchmarkNode, fitnessHistory: FitnessNode[]): Promise<MutationNode>;
}
/** Select a winner between parent and mutant */
export interface Selector {
    select(parentId: string, mutantId: string, parentFitness: FitnessNode, mutantFitness: FitnessNode): Promise<SelectionNode>;
}
/** Score an agent's execution result */
export interface Scorer {
    score(agentId: string, output: AgentOutput, cycleId: string, parentPrediction?: {
        eqs: number;
    }): Promise<FitnessNode>;
}
/** A single evolution cycle: benchmark → mutate → test → select → score */
export interface EvolutionCycle {
    /** Run one full cycle and return the score */
    runCycle(cycleId: string): Promise<SevoScoreNode>;
}
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
/** Validate that a node has all required SeVoNode fields */
export declare function isValidNode(node: unknown): node is SeVoNode;
/** Validate that agent output conforms to the contract */
export declare function isValidAgentOutput(output: unknown): output is AgentOutput;
/** Validate that a goal.jsonld conforms to the contract */
export declare function isValidGoal(goal: unknown): goal is Goal;
/** All valid node @type values in the SEVO ecosystem */
export declare const NODE_TYPES: readonly ["Agent", "Fitness", "Mutation", "Selection", "Benchmark", "SeedImprovement", "Crossover", "Novelty", "Island", "EvolutionStrategy", "SevoScore"];
export type NodeType = (typeof NODE_TYPES)[number];
/** Map from node @type to its graph directory name */
export declare const TYPE_TO_DIR: Record<NodeType, string>;
