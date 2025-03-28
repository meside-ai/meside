export const getMcpToolsConfig = async (): Promise<
  {
    type: "sse";
    url: string;
  }[]
> => {
  return [
    {
      type: "sse",
      url: "http://localhost:3002/meside/warehouse/api/mcp/warehouse",
    },
  ];
};
