import type { ReactNode } from "react";
import { Button } from "./button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed bg-muted/40 p-6">
      <div className="grid max-w-lg gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}

export { Button as EmptyStateButton };
