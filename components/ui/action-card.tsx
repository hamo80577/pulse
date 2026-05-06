import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export function ActionCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
