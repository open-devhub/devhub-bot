import type { EmitterWebhookEventName } from "@octokit/webhooks";
import { EventHandlerModule } from "../types/eventHandler.js";

export function defineEventHandler<E extends EmitterWebhookEventName>(
  handler: EventHandlerModule<E>,
): EventHandlerModule<E> {
  return handler;
}
