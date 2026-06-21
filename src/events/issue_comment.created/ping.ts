import { Context } from "probot";

const startedAt = Date.now();

export default async (context: Context<"issue_comment.created">) => {
  const { comment, sender } = context.payload;

  if (!comment.body.trim().startsWith("!ping")) return;

  if (sender.type === "Bot") return;

  const receivedAt = Date.now();
  const uptimeMs = receivedAt - startedAt;
  const uptimeSec = Math.floor(uptimeMs / 1000);

  const reply = [
    "🏓 **Pong!**",
    "",
    `\`Uptime:\` ${uptimeSec}s`,
    `\`Event:\` issue_comment.created`,
    `\`Triggered by:\` @${sender.login}`,
    `\`Repo:\` ${context.payload.repository.full_name}`,
  ].join("\n");

  await context.octokit.rest.issues.createComment(
    context.issue({ body: reply }),
  );
};
