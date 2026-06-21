export interface ParsedConventionalCommit {
  type: string;
  scope: string | null;
  breaking: boolean;
  description: string;
}

const CONVENTIONAL_COMMIT_REGEX =
  /^(?<type>[a-zA-Z]+)(?:\((?<scope>[^()]+)\))?(?<breaking>!)?: (?<description>.+)$/;

export const VALID_TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
] as const;

export function parseConventionalCommit(
  message: string,
): ParsedConventionalCommit | null {
  const header = message.split("\n")[0].trim();
  const match = header.match(CONVENTIONAL_COMMIT_REGEX);

  if (!match || !match.groups) return null;

  const { type, scope, breaking, description } = match.groups;

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return null;
  }

  return {
    type,
    scope: scope ?? null,
    breaking: Boolean(breaking),
    description,
  };
}
