import { getQuestionList } from "@/queries/question";
import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
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
    <Box mx="md" pt="md">
      <Title
        order={1}
        mb="md"
        style={{
          fontFamily: "Assistant",
          fontOpticalSizing: "auto",
          fontWeight: 500,
          fontStyle: "normal",
          color: "#fff",
          letterSpacing: "-0.5px",
        }}
      >
        meside
      </Title>
      <Button
        size="md"
        variant="light"
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
            <NavLink
              key={question.questionId}
              active={question.questionId === activeQuestionId}
              label={question.shortName}
              onClick={() => setQuestionId(question.questionId)}
              style={{
                borderRadius: 8,
              }}
            />
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
          <Avatar size="sm">CW</Avatar>
          <Text size="sm">My profile</Text>
        </Group>
      </Card>
    </Box>
  );
};
