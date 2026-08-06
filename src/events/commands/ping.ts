import { defineEvent } from "../../lib/eventHandler.js";

export default defineEvent({
  events: ["issue_comment.created"],
  callback: async (context) => {
    const body = context.payload.comment.body?.trim().toLowerCase();

    if (body !== "!ping") return;

    const start = Date.now();

    const { owner, repo } = context.repo();

    const latency = Date.now() - start;
    const uptime = process.uptime();
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;

    const formatUptime = (s: number) => {
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      return `${d}d ${h}h ${m}m ${sec}s`;
    };

    const reply = [
      "## 🏓 Pong!",
      "| Metric | Value |",
      "|--------|-------|",
      `| Response Time | ${latency} ms |`,
      `| Uptime | ${formatUptime(uptime)} |`,
      `| Memory Usage | ${memory.toFixed(2)} MB |`,
      `| Node.js | ${process.version} |`,
      `| Timestamp | ${new Date().toISOString()} |`,
      "",
    ].join("\n");

    await context.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: context.payload.issue.number,
      body: reply,
    });
  },
});
