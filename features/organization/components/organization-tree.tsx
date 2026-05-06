import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        No chains exist yet. Create a chain to start the organization tree.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {chains.map((chain) => (
        <Card key={chain.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{chain.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {chain.status}
              </span>
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
                      <span className="text-xs text-muted-foreground">
                        {branch.status}
                      </span>
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
