import {
  Anchor,
  Button,
  Card,
  Center,
  Flex,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";

const SignupPage = () => {
  return (
    <Center h="100dvh">
      <Card shadow="sm" radius="md" withBorder w="420px" p="lg">
        <Flex direction="column" gap="md" px="lg" py="md">
          <Title order={3} ta="center">
            Sign up
          </Title>
          <TextInput label="Name" placeholder="John Doe" />
          <TextInput label="Email" type="email" placeholder="name@acme.com" />
          <PasswordInput label="Password" placeholder="••••••••••" />
          <Button>Create my account</Button>
          <Space h="sm" />
          <Text size="sm" ta="center">
            <span>{`Have an account? `}</span>
            <Anchor component={Link} href="/login">
              Log in
            </Anchor>
          </Text>
          <Text ta="center" size="xs">
            <Anchor href="/privacy">Privacy Policy</Anchor>
          </Text>
        </Flex>
      </Card>
    </Center>
  );
};

export default SignupPage;
