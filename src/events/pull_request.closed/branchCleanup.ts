import { Context } from "probot";

export default async (context: Context<"pull_request.closed">) => {
  if (!context.payload.pull_request.merged) return;

  const { owner, repo } = context.repo();
  const branchName = context.payload.pull_request.head.ref;

  if (!branchName.startsWith("devhub-bot/")) return;

  try {
    await context.octokit.rest.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });
  } catch (err: any) {
    if (err.status !== 422 && err.status !== 404) throw err;
  }
};
