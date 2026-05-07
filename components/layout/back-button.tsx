"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      aria-label="Go back"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push("/");
      }}
      size="sm"
      type="button"
      variant="outline"
    >
      <ArrowLeft data-icon="inline-start" />
      Back
    </Button>
  );
}
