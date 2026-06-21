import { Context } from "probot";
import { ISSUE_LABEL_RULES } from "../../config/issueLabelRules.js";
import { ensureLabelExists } from "../../utils/ensureLabel.js";
import { titleMatchesKeyword } from "../../utils/textMatch.js";

export default async (context: Context<"issues.opened">) => {
  const { title } = context.payload.issue;

  const labelsToApply = ISSUE_LABEL_RULES.filter((rule) =>
    rule.keywords.some((keyword) => titleMatchesKeyword(title, keyword)),
  ).map((rule) => rule.label);

  if (labelsToApply.length === 0) return;

  for (const label of labelsToApply) {
    await ensureLabelExists(context, label);
  }

  await context.octokit.rest.issues.addLabels(
    context.issue({ labels: labelsToApply.map((l) => l.name) }),
  );
};
