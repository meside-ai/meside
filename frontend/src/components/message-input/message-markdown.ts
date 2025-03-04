import type { JSONContent } from "@tiptap/react";

export function jsonToMarkdown(json: JSONContent): string {
  if (!json) return "";

  switch (json.type) {
    case "doc":
      return processNodes(json.content || []);

    case "paragraph":
      return `${processNodes(json.content || [])}\n`;

    case "text":
      return json.text || "";

    case "hardBreak":
      return "\n";

    case "table":
      return processTable(json.content || []);

    case "mention":
      return `${json.attrs?.label ?? ""} `;

    default:
      return "";
  }
}

function processNodes(nodes: JSONContent[]): string {
  return nodes.map((node) => jsonToMarkdown(node)).join("");
}

function processTable(rows: JSONContent[]): string {
  if (!rows.length) return "";

  let markdown = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.content || [];

    if (!cells.length) continue;

    markdown += "|";
    for (const cell of cells) {
      markdown += ` ${processTableCell(cell)} |`;
    }
    markdown += "\n";

    if (i === 0) {
      markdown += "|";
      for (let j = 0; j < cells.length; j++) {
        markdown += " --- |";
      }
      markdown += "\n";
    }
  }

  return `${markdown}\n`;
}

function processTableCell(cell: JSONContent): string {
  return processNodes(cell.content || [])
    .replace(/\n/g, " ")
    .trim();
}
