// Auto-publish SevoScore to sevoagents.com
// Fire-and-forget — never blocks evolution, silent on failure.

import type { SevoScoreNode } from "./types.js";

const DEFAULT_ENDPOINT = "https://sevo-web-964388148061.europe-west1.run.app/api/projects";
const TIMEOUT_MS = 5_000;

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
export async function publishScore(
  score: SevoScoreNode,
  options: PublishOptions,
): Promise<boolean> {
  try {
    const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: options.name,
        description: options.description ?? "",
        scoreData: {
          sevoScore: score.score,
          cyclePoints: score.cyclePoints,
          breakdown: score.breakdown,
          metadata: score.metadata,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[sevo-score] publish failed (${res.status}): ${body.slice(0, 200)}`);
    }
    return res.ok;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sevo-score] publish failed: ${msg}`);
    return false;
  }
}
