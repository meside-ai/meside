export type EditorJSONContent = {
  type?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  attrs?: Record<string, any>;
  content?: EditorJSONContent[];
  marks?: {
    type: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    attrs?: Record<string, any>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [key: string]: any;
  }[];
  text?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

export const editorJsonToMarkdown = (json: EditorJSONContent): string => {
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
};

const processNodes = (nodes: EditorJSONContent[]): string => {
  return nodes.map((node) => editorJsonToMarkdown(node)).join("");
};

const processTable = (rows: EditorJSONContent[]): string => {
  if (!rows.length) return "";

  let markdown = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row?.content || [];

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
};

const processTableCell = (cell: EditorJSONContent): string => {
  return processNodes(cell.content || [])
    .replace(/\n/g, " ")
    .trim();
};
