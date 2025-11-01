import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Store className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No vendor selected</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Select a vendor from the dropdown above to view and manage their
          product rates.
        </p>
      </CardContent>
    </Card>
  );
}