import AuthAppShell from "../_components/AuthAppShell";
import ClientAuthGuard from "../_components/ClientAuthGuard";

export default function Authenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <AuthAppShell>{children}</AuthAppShell>
    </ClientAuthGuard>
  );
}
