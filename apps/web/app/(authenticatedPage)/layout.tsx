import AuthAppShell from "../_components/AuthAppShell";

export default function Authenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthAppShell>{children}</AuthAppShell>;
}
