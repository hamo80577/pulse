import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PaginationControls({
  basePath,
  page,
  hasNextPage,
}: {
  basePath: "/requests" | "/approvals" | "/admin/approvals";
  page: number;
  hasNextPage: boolean;
}) {
  if (page <= 1 && !hasNextPage) {
    return null;
  }

  const previousHref = page > 2 ? `${basePath}?page=${page - 1}` : basePath;
  const nextHref = `${basePath}?page=${page + 1}`;

  return (
    <nav className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>Page {page}</span>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Button asChild size="sm" variant="outline">
            <Link href={previousHref}>Previous</Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            Previous
          </Button>
        )}
        {hasNextPage ? (
          <Button asChild size="sm" variant="outline">
            <Link href={nextHref}>Next</Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}
