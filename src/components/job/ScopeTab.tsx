import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { JobDetail } from "@/data/dummyJobDetails";

interface ScopeTabProps {
  job: JobDetail;
}

export function ScopeTab({ job }: ScopeTabProps) {
  return (
    <div className="space-y-3">
      {/* Job Description / Scope */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Job Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-card-foreground leading-relaxed">
            {job.description || "No scope description available."}
          </p>
        </CardContent>
      </Card>

      {/* Materials list — no prices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Materials Required</CardTitle>
        </CardHeader>
        <CardContent>
          {job.materials.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No materials listed</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right w-20">Qty</TableHead>
                  <TableHead className="w-20">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-right">{m.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{m.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
