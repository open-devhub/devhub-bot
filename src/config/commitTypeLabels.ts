export interface LabelConfig {
  name: string;
  color: string; // just the hex without #
  description: string;
}

export const COMMIT_TYPE_LABELS: Record<string, LabelConfig> = {
  feat: { name: "feat", color: "0E8A16", description: "New feature" },
  fix: { name: "fix", color: "D73A4A", description: "Bug fix" },
  docs: {
    name: "docs",
    color: "0075CA",
    description: "Documentation only changes",
  },
  style: {
    name: "style",
    color: "CFD3D7",
    description: "Code style / formatting changes",
  },
  refactor: {
    name: "refactor",
    color: "A2EEEF",
    description: "Code change that neither fixes a bug nor adds a feature",
  },
  perf: {
    name: "perf",
    color: "FBCA04",
    description: "Performance improvement",
  },
  test: {
    name: "test",
    color: "BFD4F2",
    description: "Adding or updating tests",
  },
  build: {
    name: "build",
    color: "5319E7",
    description: "Build system or external dependency changes",
  },
  ci: { name: "ci", color: "1D76DB", description: "CI configuration changes" },
  chore: {
    name: "chore",
    color: "E4E669",
    description: "Other changes that don't modify src or test files",
  },
  revert: {
    name: "revert",
    color: "B60205",
    description: "Reverts a previous commit",
  },
};
