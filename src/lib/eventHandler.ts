import type { EmitterWebhookEventName } from "@octokit/webhooks";
import { EventHandlerModule } from "../types/eventHandler.js";

export function defineEvent<E extends EmitterWebhookEventName>(
  handler: EventHandlerModule<E>,
): EventHandlerModule<E> {
  return handler;
}
