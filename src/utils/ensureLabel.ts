import { Context } from "probot";
import { LabelConfig } from "../config/commitTypeLabels.js";

export async function ensureLabelExists(
  context: Context,
  label: LabelConfig,
): Promise<void> {
  const { owner, repo } = context.repo();

  try {
    await context.octokit.rest.issues.getLabel({
      owner,
      repo,
      name: label.name,
    });
  } catch (err: any) {
    if (err.status === 404) {
      await context.octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label.name,
        color: label.color,
        description: label.description,
      });
    } else {
      throw err;
    }
  }
}
