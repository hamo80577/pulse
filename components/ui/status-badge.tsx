import { Badge } from "./badge";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replaceAll("_", " ");

  return <Badge variant="secondary">{normalized}</Badge>;
}
