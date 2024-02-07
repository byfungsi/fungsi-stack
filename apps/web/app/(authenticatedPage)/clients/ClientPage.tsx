"use client";

import { Button, Card, Group, Stack, Title } from "@mantine/core";
import { EditIcon, TrashIcon, UserPlus } from "lucide-react";
import { DataTable } from "mantine-datatable";
import { useDisclosure } from "@mantine/hooks";
import useGetClientsQuery from "../../_hooks/useGetClientsQuery";
import CreateClientModal from "./CreateClientModal";

const ClientPage = () => {
  const { data, isPending } = useGetClientsQuery();
  const [
    isCreateClientOpen,
    { open: openCreateClient, close: closeCreateClient },
  ] = useDisclosure(false);
  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Title order={1}>Client Management</Title>
          <Button leftSection={<UserPlus />} onClick={() => openCreateClient()}>
            Create Client
          </Button>
        </Group>
        <Card mih={300}>
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            fetching={isPending}
            highlightOnHover
            records={data?.data.data}
            columns={[
              {
                accessor: "id",
                title: "#",
                render: (_data, index) => <p>{index + 1}</p>,
                width: 50,
              },
              {
                accessor: "name",
              },
              {
                accessor: "id",
                title: "Action",
                render: () => (
                  <Group>
                    <Button
                      size="compact-sm"
                      variant="outline"
                      leftSection={<EditIcon size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="compact-sm"
                      variant="outline"
                      color="red"
                      leftSection={<TrashIcon size={16} />}
                    >
                      Delete
                    </Button>
                  </Group>
                ),
              },
            ]}
          />
        </Card>
      </Stack>
      <CreateClientModal
        opened={isCreateClientOpen}
        onClose={closeCreateClient}
      />
    </>
  );
};

export default ClientPage;
