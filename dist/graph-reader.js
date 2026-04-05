// Platform-agnostic graph reader interface.
// Projects provide their own implementation (Deno fs, Node fs, etc.)
/**
 * Detect fork point from git history.
 * If goal.jsonld was modified after its initial creation, this repo was forked.
 * Returns the ISO timestamp of the fork commit, or null for original projects.
 */
export async function detectForkPoint(git) {
    const timestamps = await git.fileCommitTimestamps("goal.jsonld");
    if (timestamps.length <= 1)
        return null;
    // Most recent touch is the fork (when goal.jsonld was rewritten for new domain)
    return new Date(timestamps[0]).toISOString();
}
/** Create a node timestamp filter for fork-aware scoring */
export function createForkFilter(forkPoint) {
    if (!forkPoint)
        return (_n) => true;
    return (n) => n.timestamp >= forkPoint;
}
