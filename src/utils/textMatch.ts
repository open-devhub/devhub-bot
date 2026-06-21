export function titleMatchesKeyword(title: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped.replace(/\s+/g, "\\s+")}\\b`, "i");
  return pattern.test(title);
}
