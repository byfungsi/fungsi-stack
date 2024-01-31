"use client";
import {
  AppShell,
  Avatar,
  Button,
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
import { LogOut } from "lucide-react";

export default function AuthAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <Avatar mr="sm">BS</Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item p="md">Jane Doe</Menu.Item>
                <Menu.Divider />
                <Group px="md" py="xs">
                  <Button variant="outline" size="xs" radius="lg">
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
              label="halo"
              component={Link}
              href="/login"
              description={"mana ada"}
            />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </Flex>
  );
}
