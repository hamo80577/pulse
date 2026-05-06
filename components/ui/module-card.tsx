import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { StatusBadge } from "./status-badge";

export function ModuleCard({
  title,
  status,
  children,
  action,
}: {
  title: string;
  status: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <CardTitle>{title}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="grid gap-4">
        {children}
        {action}
      </CardContent>
    </Card>
  );
}
