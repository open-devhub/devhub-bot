import fsp from "fs/promises";
import path from "path";
import { Probot } from "probot";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (app: Probot) => {
  const eventsDir = path.join(__dirname, "events");
  const eventNames = await fsp.readdir(eventsDir);

  for (const eventName of eventNames) {
    const eventDirPath = path.join(eventsDir, eventName);
    const stat = await fsp.stat(eventDirPath);
    if (!stat.isDirectory()) continue;

    const handlerFiles = (await fsp.readdir(eventDirPath)).filter(
      (file) => file.endsWith(".js") && !file.endsWith(".d.ts"),
    );

    for (const file of handlerFiles) {
      const handlerPath = path.join(eventDirPath, file);
      const mod = await import(handlerPath);
      const handler = mod.default;

      if (typeof handler !== "function") {
        app.log.warn(
          `[WARN] Skipped ${eventName}/${file}: no default export function`,
        );
        continue;
      }

      app.on(eventName as any, handler);
      app.log.info(`Registered: ${eventName} → ${file}`);
    }
  }
};
