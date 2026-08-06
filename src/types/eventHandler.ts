import type { EmitterWebhookEventName } from "@octokit/webhooks";
import { Context } from "probot";

export interface EventHandlerModule<
  E extends EmitterWebhookEventName = EmitterWebhookEventName,
> {
  events: E[];
  callback: (context: Context<E>) => unknown;
}
