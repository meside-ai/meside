import { Box, Button } from "@mantine/core";
import { useState } from "react";
import { DbWorkflowStarter } from "./db-workflow-starter";

export const StarterPanel = () => {
  const [workflowType, setWorkflowType] = useState<"db" | "echarts">("db");

  return (
    <Box>
      <Box>
        <Button>Data warehouse query</Button>
        <Button>Bar chart</Button>
        <Button>Line chart</Button>
        <Button>Pie chart</Button>
        <Button>Scatter plot</Button>
        <Button>Heatmap</Button>
        <Button>Word cloud</Button>
      </Box>
      <Box>{workflowType === "db" && <DbWorkflowStarter />}</Box>
    </Box>
  );
};
