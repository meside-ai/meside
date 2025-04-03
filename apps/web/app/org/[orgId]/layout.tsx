"use client";

import { Avatar, Box, Tooltip, UnstyledButton } from "@mantine/core";
import { IconHome2, IconSettings } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { MyAvatar } from "../../../components/avatar/my-avatar";
import { Logo } from "../../../components/brand/logo";
import { getMe } from "../../../queries/auth";
import classes from "./layout.module.css";

interface OrgLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: OrgLayoutProps) {
  const navigate = useRouter();
  const [active, setActive] = useState("Teams");
  const { orgId } = useParams();

  const mainLinksMockdata = useMemo(
    () => [
      { icon: IconHome2, label: "Teams", href: `/org/${orgId}/channel` },
      { icon: IconSettings, label: "Settings", href: `/org/${orgId}/setting` },
    ],
    [orgId],
  );

  const mainLinks = useMemo(
    () =>
      mainLinksMockdata.map((link) => (
        <Tooltip
          label={link.label}
          position="right"
          withArrow
          transitionProps={{ duration: 0 }}
          key={link.label}
        >
          <UnstyledButton
            className={classes.link}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--mantine-radius-md)",
            }}
            onClick={() => {
              setActive(link.label);
              navigate.push(link.href);
            }}
            data-active={link.label === active || undefined}
          >
            <link.icon size={22} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      )),
    [active, mainLinksMockdata, navigate],
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        component="nav"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
          justifyContent: "space-between",
        }}
      >
        <Box
          id="nav-top"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <UnstyledButton
              onClick={() => {
                navigate.push("/");
              }}
            >
              <Logo icon />
            </UnstyledButton>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--mantine-spacing-xs)",
              marginTop: "var(--mantine-spacing-xs)",
              marginBottom: "var(--mantine-spacing-xs)",
              marginLeft: "var(--mantine-spacing-xs)",
              marginRight: "var(--mantine-spacing-xs)",
            }}
          >
            {mainLinks}
          </Box>
        </Box>
        <Box
          id="nav-bottom"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          mb="md"
        >
          <MyAvatar />
        </Box>
      </Box>
      {children}
    </Box>
  );
}

const MyProfile = () => {
  const navigate = useRouter();
  const { data } = useQuery(getMe({}));

  return (
    <UnstyledButton
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        navigate.push("/setting");
      }}
    >
      <Avatar size="sm" color="blue">
        {data?.user.name.charAt(0)}
      </Avatar>
    </UnstyledButton>
  );
};
