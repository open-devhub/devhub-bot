import fsp from "fs/promises";
import path from "path";
import { Probot } from "probot";
import { fileURLToPath } from "url";
import { EventHandlerModule } from "./types/eventHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function collectHandlerFiles(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectHandlerFiles(fullPath)));
      continue;
    }

    if (entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

export default async (app: Probot) => {
  const eventsDir = path.join(__dirname, "events");
  const handlerFiles = await collectHandlerFiles(eventsDir);

  for (const handlerPath of handlerFiles) {
    const mod = await import(handlerPath);
    const handler: EventHandlerModule | undefined = mod.default;
    const relPath = path.relative(eventsDir, handlerPath);

    if (
      !handler ||
      typeof handler.callback !== "function" ||
      !Array.isArray(handler.events)
    ) {
      app.log.warn(`[WARN] Skipped ${relPath}: missing events[] or callback()`);
      continue;
    }

    for (const eventName of handler.events) {
      app.on(eventName, handler.callback);
      app.log.info(`[SUCCESS] Registered: ${eventName} -- ${relPath}`);
    }
  }
};
