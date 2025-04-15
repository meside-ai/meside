import { Box, Tooltip, UnstyledButton } from "@mantine/core";
import { IconHome2, IconSettings } from "@tabler/icons-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { MyAvatar } from "../../../components/avatar/my-avatar";
import { IconLogo } from "../../../components/brand/icon-logo";
import classes from "./layout.module.css";

export default function Sidebar() {
  const navigate = useRouter();
  const { orgId } = useParams();
  const pathname = usePathname();

  const mainLinksData = useMemo(
    () => [
      { icon: IconHome2, label: "Teams", href: `/org/${orgId}/channel` },
      { icon: IconSettings, label: "Settings", href: `/org/${orgId}/setting` },
    ],
    [orgId],
  );

  const mainLinks = useMemo(
    () =>
      mainLinksData.map((link) => (
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
              navigate.push(link.href);
            }}
            data-active={pathname.startsWith(link.href)}
          >
            <link.icon size={22} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      )),
    [mainLinksData, navigate, pathname],
  );

  return (
    <>
      <Box
        id="nav-top"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box pb={6} pt={6}>
          <UnstyledButton
            onClick={() => {
              navigate.push("/");
            }}
          >
            <IconLogo />
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
    </>
  );
}
