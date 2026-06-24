import { Context } from "probot";

export default async (context: Context<"workflow_run.completed">) => {
  const lintWorkflows = ["lint", "super-linter", "lint check", "code quality"];

  const workflowName = context.payload.workflow_run.name?.toLowerCase() ?? "";

  if (!lintWorkflows.includes(workflowName)) {
    return;
  }

  const { owner, repo } = context.repo();
  const workflowRun = context.payload.workflow_run;

  if (workflowRun.conclusion === "success") {
    const pullRequests = workflowRun.pull_requests as Array<{ number: number }>;
    if (!pullRequests || pullRequests.length === 0) return;

    const pull_number = pullRequests[0].number;

    const body = [
      "> [!NOTE]",
      "> Linting checks passed successfully 🎉",
      "",
      "All formatting and code quality checks are clean.",
      "",
      "You’re good to merge 🚀",
    ].join("\n");

    await context.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body,
    });

    return;
  }

  // Find the PR associated with this workflow run
  const pullRequests = workflowRun.pull_requests as Array<{ number: number }>;

  if (!pullRequests || pullRequests.length === 0) return;

  const pull_number = pullRequests[0].number;

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
