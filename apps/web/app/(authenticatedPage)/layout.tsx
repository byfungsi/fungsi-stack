import AuthAppShell from "../_components/AuthAppShell";
import ServerAuthGuard from "../_components/ServerAuthGuard";

export default function Authenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerAuthGuard>
      <AuthAppShell>{children}</AuthAppShell>
    </ServerAuthGuard>
  );
}
