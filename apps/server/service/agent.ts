import type { AgentDto } from "@meside/shared/api/agent.schema";

const agentList = new Map<string, AgentDto>([
  [
    "Data Warehouse Agent",
    {
      agentId: "1",
      name: "Data Warehouse Agent",
      backstory: "You are a helpful assistant that can help with SQL queries.",
      instruction: [
        "1. first get all warehouses",
        "2. If you dont know should query which warehouse, then use human-input tool to get the warehouse name",
        "3. get all tables",
        "4. get all columns in the specific table",
        "5. run query to validate the question",
      ].join("\n"),
      goal: [
        "1. if validate is ok, must return the query url in the response, dont return sql query code in the response",
        "2. if validate is not ok, return the human readable error message",
        "3. final response must be the markdown format",
      ].join("\n"),
      llmId: "y09mvxb9g8rtwdzke2gdkhbd",
      toolIds: ["1", "2"],
      ownerId: "1",
      orgId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  ],
  [
    "Echart Software Engineer",
    {
      agentId: "2",
      name: "Echart Software Engineer",
      backstory:
        "You are a software engineer that can help with echart development.",
      instruction: [
        "1. get the sql query from the previous messages, if not found, return the human readable error message and ask human to input the which sql do they want to query",
        "2. if found, return the echart code in the response",
      ].join("\n"),
      goal: ["1. final response must be the markdown format"].join("\n"),
      llmId: "y09mvxb9g8rtwdzke2gdkhbd",
      toolIds: ["1", "2"],
      ownerId: "1",
      orgId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    },
  ],
]);

export const getAgentList = async (): Promise<AgentDto[]> => {
  return Array.from(agentList.values());
};

export const getAgentDetail = async (agentName: string): Promise<AgentDto> => {
  console.log("agentName", agentName);
  const agent = agentList.get(agentName);
  if (!agent) {
    throw new Error("Agent not found");
  }
  return agent;
};
