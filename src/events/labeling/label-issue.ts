import { ISSUE_LABEL_RULES } from "../../config/issueLabelRules.js";
import { defineEventHandler } from "../../lib/eventHandler.js";
import { ensureLabelExists } from "../../utils/ensureLabel.js";
import { titleMatchesKeyword } from "../../utils/textMatch.js";

export default defineEventHandler({
  events: ["issues.opened"],
  callback: async (context) => {
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
  },
});
