"use client";
import {
  AppShell,
  Avatar,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Menu,
  NavLink,
  Text,
  Title,
} from "@mantine/core";
import NextImage from "next/image";
import Link from "next/link";
import { HomeIcon, LogOut, UsersRound } from "lucide-react";
import useLogout from "../_hooks/useLogout";
import { getUser } from "../_utils/storage";

export default function AuthAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending, mutate } = useLogout();
  const user = getUser();
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return (
    <Flex direction="column">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: "sm" }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm">
              <Image
                component={NextImage}
                src="/logo_fungsi.png"
                alt="logo fungsi"
                width={26}
                height={26}
              />
              <Title order={4}>Auth</Title>
            </Group>
            <Menu position="bottom-end">
              <Menu.Target>
                <Avatar mr="sm">{}</Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Center p="md">Jane Doe</Center>
                <Menu.Divider />
                <Group px="md" py="xs">
                  <Button
                    variant="outline"
                    size="xs"
                    radius="lg"
                    loading={isPending}
                    onClick={() => mutate()}
                  >
                    <LogOut size={16} />
                    <Text ml="xs" size="sm">
                      Sign out
                    </Text>
                  </Button>
                </Group>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShell.Section>
            <NavLink
              label="Home"
              component={Link}
              leftSection={<HomeIcon />}
              href="/welcome"
            />
            <NavLink
              label="Client Management"
              component={Link}
              href="/clients"
              leftSection={<UsersRound />}
            />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main bg="gray.2">{children}</AppShell.Main>
      </AppShell>
    </Flex>
  );
}
