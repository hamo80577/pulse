import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

type OrganizationTreeProps = {
  chains: Array<{
    id: string;
    name: string;
    status: string;
    branches: Array<{
      id: string;
      name: string;
      status: string;
      assignments: Array<{
        id: string;
        roleAtBranch: string;
        user: {
          name: string;
          role: string;
        };
      }>;
    }>;
  }>;
};

export function OrganizationTree({ chains }: OrganizationTreeProps) {
  if (chains.length === 0) {
    return <EmptyState title="No chains yet" description="Create a chain to start the organization tree." />;
  }

  return (
    <div className="grid gap-4">
      {chains.map((chain) => (
        <Card key={chain.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{chain.name}</span>
              <StatusBadge status={chain.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chain.branches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No branches in this chain.
              </p>
            ) : (
              <div className="grid gap-3">
                {chain.branches.map((branch) => (
                  <div key={branch.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-medium">{branch.name}</h2>
                      <StatusBadge status={branch.status} />
                    </div>
                    {branch.assignments.length === 0 ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        No active assignments.
                      </p>
                    ) : (
                      <ul className="mt-3 grid gap-2 text-sm">
                        {branch.assignments.map((assignment) => (
                          <li
                            className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2"
                            key={assignment.id}
                          >
                            <span>{assignment.user.name}</span>
                            <span className="text-muted-foreground">
                              {assignment.roleAtBranch}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
