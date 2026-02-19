import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { JobDetail } from "@/data/dummyJobDetails";

interface QuoteTabProps {
  job: JobDetail;
}

export function QuoteTab({ job }: QuoteTabProps) {
  const materialsTotal = job.materials.reduce((s, m) => s + m.quantity * m.unitPrice, 0);
  const labourEstimate = job.labourTotal || 850;
  const subtotal = labourEstimate + materialsTotal;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Quote
          </CardTitle>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(var(--status-orange))] text-white">
            Draft
          </span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Labour (estimated)</TableCell>
                <TableCell className="text-right">${labourEstimate.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Materials</TableCell>
                <TableCell className="text-right">${materialsTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Subtotal</TableCell>
                <TableCell className="text-right font-bold">${subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">GST (15%)</TableCell>
                <TableCell className="text-right text-muted-foreground">${gst.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-lg">Total</TableCell>
                <TableCell className="text-right font-bold text-lg">${total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button size="lg" className="flex-1 h-12 gap-2">
          <DollarSign className="w-5 h-5" /> Send Quote
        </Button>
        <Button size="lg" variant="outline" className="h-12 gap-2">
          <Plus className="w-4 h-4" /> Add Line
        </Button>
      </div>
    </div>
  );
}
