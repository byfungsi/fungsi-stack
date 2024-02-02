"use client";

import useGetClientsQuery from "../../_hooks/useGetClientsQuery";

const ClientPage = () => {
  useGetClientsQuery();

  return <div>Halo CLient</div>;
};

export default ClientPage;
