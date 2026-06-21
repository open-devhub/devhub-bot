export interface IssueLabelRule {
  keywords: string[];
  label: { name: string; color: string; description: string };
}

export const ISSUE_LABEL_RULES: IssueLabelRule[] = [
  {
    keywords: ["bug", "broken", "crash", "crashing"],
    label: {
      name: "bug",
      color: "D73A4A",
      description: "Something isn't working",
    },
  },
  {
    keywords: ["feature", "feature request", "enhancement"],
    label: {
      name: "enhancement",
      color: "A2EEEF",
      description: "New feature or request",
    },
  },
  {
    keywords: ["question", "how do i", "how to"],
    label: {
      name: "question",
      color: "D876E3",
      description: "Further information is requested",
    },
  },
  {
    keywords: ["docs", "documentation", "typo"],
    label: {
      name: "docs",
      color: "0075CA",
      description: "Improvements or additions to documentation",
    },
  },
];
