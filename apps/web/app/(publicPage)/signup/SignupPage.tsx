"use client";
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
import { useForm } from "@mantine/form";
import Link from "next/link";
import { zodResolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import useRegisterQuery from "../../_hooks/useRegisterQuery";
import { getErrorMessage } from "../../_utils/getErrorMessage";
import { TSignupSchema, signupSchema } from "./schema";

const SignupPage = () => {
  const { mutate: register, isPending } = useRegisterQuery();
  const form = useForm<TSignupSchema>({
    validate: zodResolver(signupSchema),
  });
  const router = useRouter();
  const handleSubmit = (v: TSignupSchema) => {
    const onError = (err: Error) => {
      notifications.show({
        message: getErrorMessage(err),
        color: "red",
      });
    };
    const onSuccess = () => {
      notifications.show({
        color: "green",
        message: "Successfully register",
      });
      router.push("/login");
    };

    register(v, {
      onError,
      onSuccess,
    });
  };

  return (
    <Center h="100dvh">
      <Card shadow="sm" radius="md" withBorder w="420px" p="lg">
        <Flex direction="column" gap="md" px="lg" py="md">
          <Title order={3} ta="center">
            Sign up
          </Title>
          <Flex
            direction="column"
            gap="md"
            renderRoot={(props) => (
              <form {...props} onSubmit={form.onSubmit(handleSubmit)} />
            )}
          >
            <TextInput
              label="Name"
              placeholder="John Doe"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="name@acme.com"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="••••••••••"
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={isPending}>
              Create my account
            </Button>
          </Flex>
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
