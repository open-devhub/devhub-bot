import { Context } from "probot";

type WorkflowRunContext = Context<"workflow_run.completed">;
type WorkflowRun = WorkflowRunContext["payload"]["workflow_run"];

const LINT_WORKFLOW_NAMES = new Set([
  "lint",
  "super-linter",
  "lint check",
  "code quality",
]);

export default async (context: WorkflowRunContext): Promise<void> => {
  const workflowName =
    context.payload.workflow_run.name?.toLowerCase().trim() ?? "";

  if (!LINT_WORKFLOW_NAMES.has(workflowName)) {
    return;
  }

  const { owner, repo } = context.repo();
  const workflowRun = context.payload.workflow_run;

  const pullNumber = await resolvePullNumber(context, workflowRun, owner, repo);
  if (pullNumber === null) {
    context.log.info(
      `[lint-bot] Could not resolve a PR for workflow run ${workflowRun.id} ` +
        `(branch: ${workflowRun.head_branch ?? "unknown"}, sha: ${workflowRun.head_sha}). Skipping.`,
    );
    return;
  }

  const body =
    workflowRun.conclusion === "success"
      ? buildSuccessComment()
      : buildFailureComment(owner, repo, workflowRun.id);

  await context.octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });
};

function buildSuccessComment(): string {
  return [
    "> [!NOTE]",
    "> Linting checks passed successfully 🎉",
    "",
    "All formatting and code quality checks are clean.",
    "",
    "You're good to merge 🚀",
  ].join("\n");
}

function buildFailureComment(
  owner: string,
  repo: string,
  runId: number,
): string {
  const logsUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;

  return [
    "> [!WARNING]",
    "> Linting checks did not pass for this PR.",
    ">",
    `> Run: [View logs](${logsUrl})`,
    "",
    "> [!TIP]",
    "> Make sure to check the following before pushing:",
    ">",
    "> - code formatting issues",
    "> - code quality / linting errors",
    "> - unused or broken imports",
    "> - syntax or type issues (if applicable)",
    "> - secret leaks or exposed credentials",
    "> - security / dependency vulnerabilities",
    "> - invalid YAML / JSON / config files",
    ">",
    "> Then fix the issues, commit, and push again.",
    "",
    "> [!NOTE]",
    "> This is just a friendly reminder and will **not block** the PR from being merged.",
    "",
  ].join("\n");
}

async function resolvePullNumber(
  context: WorkflowRunContext,
  workflowRun: WorkflowRun,
  owner: string,
  repo: string,
): Promise<number | null> {
  const headSha: string = workflowRun.head_sha;
  const headBranch: string | null = workflowRun.head_branch ?? null;

  const directPRs = workflowRun.pull_requests as Array<{
    number: number;
  }> | null;
  if (directPRs && directPRs.length > 0) {
    return directPRs[0].number;
  }

  if (!headBranch) {
    return null;
  }

  try {
    const { data: samePRs } = await context.octokit.rest.pulls.list({
      owner,
      repo,
      state: "open",
      head: `${owner}:${headBranch}`,
    });

    const sameRepoMatch = samePRs.find((pr) => pr.head.sha === headSha);
    if (sameRepoMatch) {
      return sameRepoMatch.number;
    }
  } catch (err) {
    context.log.warn(`[lint-bot] Same-repo PR lookup failed: ${String(err)}`);
  }

  try {
    const { data: prs } = await context.octokit.rest.pulls.list({
      owner,
      repo,
      state: "open",
      per_page: 30,
    });

    const forkMatch = prs.find((pr) => pr.head.sha === headSha);
    return forkMatch?.number ?? null;
  } catch (err) {
    context.log.warn(`[lint-bot] Fork PR lookup failed: ${String(err)}`);
  }

  return null;
}
