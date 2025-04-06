export const includesMarkdownLink = (text: string): boolean => {
  // Regex to match Markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  return markdownLinkRegex.test(text);
};

export const extractMarkdownLinks = (text: string): string[] => {
  // Regex to match Markdown links with global flag to find all occurrences
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = Array.from(text.matchAll(markdownLinkRegex));

  // Extract the URLs (second capture group)
  return matches.map((match) => match[2] || "").filter((url) => url !== ""); // Filter out any empty strings just in case
};
