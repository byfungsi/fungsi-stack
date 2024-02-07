import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import useCreateClient from "../../_hooks/useCreateClient";
import { getErrorMessage } from "../../_utils/getErrorMessage";
import { TCreateClientSchema, ZCreateClientSchema } from "./createClientSchema";

interface Props {
  opened: boolean;
  onClose: () => void;
}
const CreateClientModal = ({ opened, onClose }: Props) => {
  const { isPending, mutate } = useCreateClient();
  const form = useForm<TCreateClientSchema>({
    validate: zodResolver(ZCreateClientSchema),
  });
  const handleSubmit = (value: TCreateClientSchema) => {
    const onError = (err: Error) => {
      notifications.show({
        message: getErrorMessage(err),
        color: "red",
      });
    };
    const onSuccess = () => {
      notifications.show({
        message: "Successfully create client",
        color: "green",
      });
      onClose();
    };
    mutate(value, {
      onError,
      onSuccess,
    });
  };
  return (
    <Modal title="Create Client" opened={opened} onClose={onClose}>
      <Stack
        renderRoot={(props) => (
          <form {...props} onSubmit={form.onSubmit(handleSubmit)} />
        )}
      >
        <TextInput {...form.getInputProps("name")} placeholder="Acme Client" />
        <Button type="submit" loading={isPending}>
          Create
        </Button>
      </Stack>
    </Modal>
  );
};

export default CreateClientModal;
