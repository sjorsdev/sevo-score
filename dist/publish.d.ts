import type { SevoScoreNode } from "./types.js";
export interface PublishOptions {
    /** Project name as it appears on the leaderboard */
    name: string;
    /** Project description */
    description?: string;
    /** Custom endpoint (defaults to sevoagents.com) */
    endpoint?: string;
}
/**
 * Publish a SevoScoreNode to the sevoagents.com leaderboard.
 *
 * - For private repos: this is the only way scores appear on the leaderboard.
 * - For public repos: optional (scores are read from git), but speeds up visibility.
 *
 * Fire-and-forget: returns true if published, false on any error.
 * Never throws. Never blocks the evolution loop.
 */
export declare function publishScore(score: SevoScoreNode, options: PublishOptions): Promise<boolean>;
