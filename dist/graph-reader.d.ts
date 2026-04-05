import type { SeVoNode } from "./types.js";
/** Interface for reading SEVO graph data from a directory */
export interface GraphReader {
    /** Read all JSON-LD nodes of a given type (e.g., "agent", "fitness") */
    readNodes<T extends SeVoNode>(type: string): Promise<T[]>;
    /** Count lines in all .ts files in a directory */
    countLoc(dir: string): Promise<number>;
    /** Read and parse a JSON file */
    readJson<T>(path: string): Promise<T | null>;
}
/** Interface for detecting fork point from git history */
export interface GitReader {
    /** Get author-date timestamps of all commits that touched a file, newest first */
    fileCommitTimestamps(filePath: string): Promise<string[]>;
}
/**
 * Detect fork point from git history.
 * If goal.jsonld was modified after its initial creation, this repo was forked.
 * Returns the ISO timestamp of the fork commit, or null for original projects.
 */
export declare function detectForkPoint(git: GitReader): Promise<string | null>;
/** Create a node timestamp filter for fork-aware scoring */
export declare function createForkFilter(forkPoint: string | null): <T extends {
    timestamp: string;
}>(n: T) => boolean;
