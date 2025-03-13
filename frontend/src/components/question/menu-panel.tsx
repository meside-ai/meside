import { getQuestionList } from "@/queries/question";
import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQuestionContext } from "./context";

export const MenuPanel = () => {
  return (
    <Box
      h="100%"
      display="flex"
      style={{
        flexDirection: "column",
        overflow: "hidden",
        background: "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box style={{ overflow: "hidden" }} mb="lg">
        <StartPanel />
      </Box>
      <Box flex={1} style={{ overflow: "hidden" }}>
        <ThreadPanel />
      </Box>
      <Box mb="md">
        <MyProfile />
      </Box>
    </Box>
  );
};

const StartPanel = () => {
  const { setQuestionId } = useQuestionContext();

  return (
    <Box
      mx="md"
      pt="md"
      display="flex"
      style={{ flexDirection: "column", alignItems: "center" }}
    >
      <Title
        order={1}
        mb="md"
        style={{
          fontFamily: "Assistant",
          fontOpticalSizing: "auto",
          fontWeight: 600,
          fontStyle: "normal",
          color: "#000",
          letterSpacing: "0px",
          textAlign: "center",
        }}
      >
        meside
      </Title>
      <Button
        size="md"
        onClick={() => {
          setQuestionId(null);
        }}
        leftSection={<IconMessageCircle size={16} />}
      >
        New Chat
      </Button>
    </Box>
  );
};

export const ThreadPanel = () => {
  const { questionId: activeQuestionId, setQuestionId } = useQuestionContext();

  const { data } = useQuery(getQuestionList({}));

  return (
    <Box style={{ height: "100%", overflow: "overflow" }}>
      <ScrollArea h="100%" scrollbars="y">
        <Box mx="md">
          {data?.questions.map((question) => (
            <UnstyledButton
              key={question.questionId}
              // active={question.questionId === activeQuestionId}
              // label={question.shortName}
              bg={
                question.questionId === activeQuestionId ? "dark.5" : undefined
              }
              c={question.questionId === activeQuestionId ? "white" : undefined}
              fz={14}
              px="md"
              py="xs"
              onClick={() => setQuestionId(question.questionId)}
              style={() => ({
                display: "block",
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200 - 16 * 2,
              })}
            >
              {question.shortName}
            </UnstyledButton>
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
};

const MyProfile = () => {
  return (
    <Box mx="md">
      <Card p="xs" style={{ cursor: "pointer" }}>
        <Group gap="xs">
          <Avatar size="sm" color="blue">
            CW
          </Avatar>
          <Text size="sm">My profile</Text>
        </Group>
      </Card>
    </Box>
  );
};
