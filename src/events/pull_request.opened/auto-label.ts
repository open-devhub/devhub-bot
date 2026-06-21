import { Context } from "probot";
import { COMMIT_TYPE_LABELS } from "../../config/commitTypeLabels.js";
import { parseConventionalCommit } from "../../utils/conventionalCommit.js";
import { ensureLabelExists } from "../../utils/ensureLabel.js";

export default async (context: Context<"pull_request.opened">) => {
  const { owner, repo } = context.repo();
  const pull_number = context.payload.pull_request.number;

  const commits = await context.octokit.paginate(
    context.octokit.rest.pulls.listCommits,
    { owner, repo, pull_number, per_page: 100 },
  );

  const typesFound = new Set<string>();
  let hasBreaking = false;

  for (const commit of commits) {
    const message = commit.commit.message.split("\n")[0];
    const parsed = parseConventionalCommit(message);
    if (!parsed) continue;

    if (COMMIT_TYPE_LABELS[parsed.type]) typesFound.add(parsed.type);
    if (parsed.breaking) hasBreaking = true;
  }

  const titleParsed = parseConventionalCommit(
    context.payload.pull_request.title,
  );
  if (titleParsed) {
    if (COMMIT_TYPE_LABELS[titleParsed.type]) typesFound.add(titleParsed.type);
    if (titleParsed.breaking) hasBreaking = true;
  }

  if (typesFound.size === 0 && !hasBreaking) return;

  const labelsToApply = [...typesFound].map((type) => COMMIT_TYPE_LABELS[type]);

  for (const label of labelsToApply) {
    await ensureLabelExists(context, label);
  }

  await context.octokit.rest.issues.addLabels(
    context.issue({ labels: labelsToApply.map((l) => l.name) }),
  );
};
