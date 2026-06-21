import { Context } from "probot";
import { parseConventionalCommit } from "../../utils/conventionalCommit.js";

export default async (context: Context<"pull_request.opened">) => {
  const { owner, repo } = context.repo();
  const pull_number = context.payload.pull_request.number;
  const prTitle = context.payload.pull_request.title;

  const problems: string[] = [];

  if (!parseConventionalCommit(prTitle)) {
    problems.push(
      `PR title does not follow Conventional Commits: \`${prTitle}\``,
    );
  }

  const commits = await context.octokit.paginate(
    context.octokit.rest.pulls.listCommits,
    { owner, repo, pull_number, per_page: 100 },
  );

  for (const commit of commits) {
    const message = commit.commit.message.split("\n")[0];
    if (!parseConventionalCommit(message)) {
      problems.push(
        `Commit \`${commit.sha.slice(0, 7)}\` does not follow Conventional Commits: \`${message}\``,
      );
    }
  }

  if (problems.length === 0) return;

  const body = [
    "⚠️ **Conventional Commits check**",
    "",
    "Some titles/commits in this PR don't follow [Conventional Commits](https://www.conventionalcommits.org/) format (`type(scope): description`):",
    "",
    ...problems.map((p) => `- ${p}`),
    "",
    "_Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert_",
    "_This is a warning only — it won't block the PR._",
  ].join("\n");

  await context.octokit.rest.issues.createComment(context.issue({ body }));
};
