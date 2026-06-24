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
        `Commit https://github.com/${owner}/${repo}/commit/${commit.sha} does not follow Conventional Commits: \`${message}\``,
      );
    }
  }

  if (problems.length === 0) return;

  const body = [
    "> [!WARNING]",
    "> Some commit messages in this PR do not follow the [**Conventional Commits**](https://conventionalcommits.org/) specification.",
    ">",
    "> Expected format: `type(scope): description`",
    "",
    "<details>",
    "<summary><strong>📋 Invalid commit messages</strong></summary>",
    "",
    ...problems.map((p) => `- ${p}`),
    "",
    "</details>",
    "",
    "> [!TIP]",
    "> **Valid types:**",
    "> `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`",
    "",
    "> [!NOTE]",
    "> This is just a friendly reminder and will **not block** the PR from being merged.",
    "",
  ].join("\n");

  await context.octokit.rest.issues.createComment(context.issue({ body }));
};
