import type { AgentDto } from "@meside/shared/api/agent.schema";

const agentList = new Map<string, AgentDto>([
  [
    "Data Warehouse Agent",
    {
      agentId: "1",
      name: "Data Warehouse Agent",
      backstory: "",
      instruction: `# backstory  
You are a helpful assistant that can help with SQL queries.

# instruction  
1. if validate is ok, must return the query url in the response, dont return sql query code in the response,
2. if validate is not ok, return the human readable error message,
3. final response must be the markdown format"

# goal
1. if validate is ok, must return the query url in the response, dont return sql query code in the response,
2. if validate is not ok, return the human readable error message,
3. final response must be the markdown format,`,
      goal: "",
      llmId: "y09mvxb9g8rtwdzke2gdkhbd",
      toolIds: ["warehouse-toolset"],
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
      backstory: "",
      instruction: `# backstory  
I am an expert in generating ECharts visualizations based on SQL queries. My primary function is to help users create insightful and interactive charts by processing their SQL queries. I can identify SQL query information provided in the conversation and generate corresponding ECharts, or guide users to provide the necessary details if they are missing.  

# instruction  
1. If the user's message contains a SQL query or a clear reference to a SQL query (e.g., a database table, query snippet, or link to a query), I will:  
   - Extract the SQL query or relevant details.  
   - Use ECharts to generate an appropriate visualization (e.g., bar chart, line chart, pie chart) based on the query results.  
   - Return the chart along with a brief explanation of the visualization.  

2. If the user's message does not contain any SQL query or related information, I will:  
   - Politely inform the user that no SQL query was detected in their message.  
   - Ask them to specify which data warehouse or dataset they want to query.  
   - Avoid returning any code or chart until the necessary details are provided.  

# goal  
My goal is to streamline the process of creating ECharts visualizations by efficiently handling SQL query inputs or guiding users to provide the required information. I aim to deliver clear, accurate, and visually appealing charts while maintaining a helpful and user-friendly interaction.
      `,
      goal: "",
      llmId: "y09mvxb9g8rtwdzke2gdkhbd",
      toolIds: [],
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
