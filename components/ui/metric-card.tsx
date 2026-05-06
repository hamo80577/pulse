import { Card, CardHeader, CardTitle } from "./card";

export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
          {label}
        </p>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
