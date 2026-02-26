import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type SequenceStep } from "@/components/FollowUpSequenceBuilder";
import { SequenceSettingsSheet } from "@/components/SequenceSettingsSheet";
import type { JobDetail } from "@/data/dummyJobDetails";
import { cn } from "@/lib/utils";

interface InvoiceTabProps {
  job: JobDetail;
}

function invoiceStatusColor(status: string) {
  if (status === "Paid") return "bg-[hsl(var(--status-green))] text-white";
  if (status === "Sent") return "bg-[hsl(var(--status-orange))] text-white";
  return "bg-secondary text-secondary-foreground";
}

export function InvoiceTab({ job }: InvoiceTabProps) {
  const [emailSeqEnabled, setEmailSeqEnabled] = useState(false);
  const [smsSeqEnabled, setSmsSeqEnabled] = useState(false);
  const [emailSteps, setEmailSteps] = useState<SequenceStep[]>([]);
  const [smsSteps, setSmsSteps] = useState<SequenceStep[]>([]);

  const materialsTotal = job.materials.reduce((s, m) => s + m.quantity * m.unitPrice, 0);
  const subtotal = job.labourTotal + materialsTotal + job.extrasTotal;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Invoice</CardTitle>
          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", invoiceStatusColor(job.invoiceStatus))}>
            {job.invoiceStatus}
          </span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Labour</TableCell>
                <TableCell className="text-right">${job.labourTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Materials</TableCell>
                <TableCell className="text-right">${materialsTotal.toFixed(2)}</TableCell>
              </TableRow>
              {job.extrasTotal > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Extras</TableCell>
                  <TableCell className="text-right">${job.extrasTotal.toFixed(2)}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="font-bold">Subtotal</TableCell>
                <TableCell className="text-right font-bold">${subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">GST (15%)</TableCell>
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

      <Button size="lg" className="w-full h-12 gap-2">
        <FileText className="w-5 h-5" /> Generate Invoice
      </Button>

      <div className="flex justify-end">
        <SequenceSettingsSheet
          category="invoices"
          emailEnabled={emailSeqEnabled}
          onEmailEnabledChange={setEmailSeqEnabled}
          emailSteps={emailSteps}
          onEmailStepsChange={setEmailSteps}
          smsEnabled={smsSeqEnabled}
          onSmsEnabledChange={setSmsSeqEnabled}
          smsSteps={smsSteps}
          onSmsStepsChange={setSmsSteps}
        />
      </div>
    </div>
  );
}
