"use client";
import {
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { AxiosResponse } from "axios";
import { TLoginResponse } from "@repo/validator";
import useLoginQuery from "../../_hooks/useLoginQuery";
import { TOKEN_KEY } from "../../_constants/keys";
import { getErrorMessage } from "../../_utils/getErrorMessage";
import { setServerToken } from "../../_actions/setServerToken";
import { TLoginSchema, loginSchema } from "./schema";

const LoginPage = () => {
  const { mutate: login, isPending } = useLoginQuery();
  const form = useForm<TLoginSchema>({
    validate: zodResolver(loginSchema),
  });
  const router = useRouter();
  const handleSubmit = (data: TLoginSchema) => {
    const onSuccess = (response: AxiosResponse<TLoginResponse>) => {
      notifications.show({
        message: "Successfully login",
        color: "green",
      });
      setCookie(TOKEN_KEY, response.data.data.accessToken);
      setServerToken(response.data.data.accessToken);
      router.push("/");
    };
    const onError = (err: Error) => {
      notifications.show({
        message: getErrorMessage(err),
        color: "red",
      });
    };
    login(data, {
      onSuccess,
      onError,
    });
  };
  return (
    <Center h="100dvh">
      <Box pos="relative">
        <Center
          bg="brand.7"
          c="white"
          className="-rotate-90   rounded-tl-md rounded-tr-md left-[-94px] top-20"
          pos="absolute"
          pb="lg"
          pt="xs"
          px="md"
        >
          <Group gap="xs" align="center">
            <Text fw={600} size="xs">
              Secured by
            </Text>
            <Text size="sm" fw="bolder">
              FUNGSI
            </Text>
          </Group>
        </Center>
        <Card shadow="sm" radius="md" withBorder w="420px" p="lg">
          <Flex
            renderRoot={(props) => (
              <form {...props} onSubmit={form.onSubmit(handleSubmit)} />
            )}
            direction="column"
            gap="md"
            px="lg"
            py="md"
          >
            <Title order={3} ta="center">
              Log in
            </Title>
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
              Continue
            </Button>
            <Space h="sm" />
            <Text size="sm" ta="center">
              <span>{`Don't have account? `}</span>
              <Anchor component={Link} href="/signup">
                Sign up
              </Anchor>
            </Text>
            <Text ta="center" size="xs">
              <Anchor href="/privacy">Privacy Policy</Anchor>
            </Text>
          </Flex>
        </Card>
      </Box>
    </Center>
  );
};

export default LoginPage;
