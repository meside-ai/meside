import { getWarehouseExecute } from "@/queries/warehouse";
import { Box, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type TableViewProps = {
  questionId: string;
};

export const TableView = ({ questionId }: TableViewProps) => {
  const { data } = useQuery(
    getWarehouseExecute({
      questionId,
    })
  );

  const rows = useMemo(() => {
    return data?.rows.slice(0, 5);
  }, [data]);

  if (!data?.fields || data?.fields.length === 0) {
    return <Text p="md">Rendering...</Text>;
  }

  return (
    <Box>
      <Table>
        <Table.Thead>
          {data?.fields.map((field) => (
            <Table.Th
              key={field.columnName}
              style={{
                width: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {field.columnName}
            </Table.Th>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {rows?.map((row) => (
            <Table.Tr key={JSON.stringify(row)}>
              {data?.fields.map((field) => (
                <Table.Td
                  key={field.columnName}
                  style={{
                    width: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(row as any)[field.columnName]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
