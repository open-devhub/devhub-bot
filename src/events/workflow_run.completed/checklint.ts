import { Context } from "probot";

export default async (context: Context<"workflow_run.completed">) => {
  const lintWorkflows = ["lint", "super-linter", "lint check", "code quality"];

  const workflowName = context.payload.workflow_run.name?.toLowerCase() ?? "";

  if (!lintWorkflows.includes(workflowName)) {
    return;
  }

  const { owner, repo } = context.repo();
  const workflowRun = context.payload.workflow_run;

  const pull_number = await resolvePullNumber(
    context,
    workflowRun,
    owner,
    repo,
  );
  if (!pull_number) return;

  if (workflowRun.conclusion === "success") {
    const body = [
      "> [!NOTE]",
      "> Linting checks passed successfully 🎉",
      "",
      "All formatting and code quality checks are clean.",
      "",
      "You're good to merge 🚀",
    ].join("\n");

    await context.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body,
    });

    return;
  }

  const logsUrl = `https://github.com/${owner}/${repo}/actions/runs/${workflowRun.id}`;

  const body = [
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

  await context.octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body,
  });
};

async function resolvePullNumber(
  context: Context<"workflow_run.completed">,
  workflowRun: Context<"workflow_run.completed">["payload"]["workflow_run"],
  owner: string,
  repo: string,
): Promise<number | null> {
  const directPRs = workflowRun.pull_requests as Array<{ number: number }>;
  if (directPRs?.length > 0) {
    return directPRs[0].number;
  }

  const headBranch = workflowRun.head_branch;
  const headSha = workflowRun.head_sha;

  if (!headBranch) return null;

  const { data: prs } = await context.octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    head: `${owner}:${headBranch}`,
  });

  const match = prs.find((pr) => pr.head.sha === headSha) ?? prs[0];
  return match?.number ?? null;
}
