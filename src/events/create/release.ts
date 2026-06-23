import { Context } from "probot";

export default async (context: Context<"create">) => {
  if (
    context.payload.ref_type !== "tag" ||
    !context.payload.ref.startsWith("v")
  ) {
    return;
  }

  const { owner, repo } = context.repo();
  const tagName = context.payload.ref; // e.g., "v1.0.0"

  try {
    const { data: fileData } = await context.octokit.rest.repos.getContent({
      owner,
      repo,
      path: "CHANGELOG.md",
      ref: tagName,
    });

    if (
      Array.isArray(fileData) ||
      fileData.type !== "file" ||
      !fileData.content
    ) {
      return;
    }

    const changelogContent = Buffer.from(fileData.content, "base64").toString(
      "utf-8",
    );

    const regex = /^(#{1,6}\s+`?v\d+(?:\.\d+)*.*?)(?=\n#{1,6}\s+`?v\d+|\n*$)/ms;
    const match = changelogContent.match(regex);

    const releaseBody = match
      ? match[1].trim()
      : `Automated release for tag ${tagName}`;

    await context.octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name: tagName,
      body: releaseBody,
      draft: false,
      prerelease: false,
    });

    context.log.info(
      `[DevHub] Successfully created release for tag: ${tagName}`,
    );
  } catch (error) {
    context.log.error(
      `[DevHub] Failed to process release workflow for tag ${tagName}: ${error}`,
    );
  }
};
