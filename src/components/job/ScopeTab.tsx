import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import type { JobDetail } from "@/data/dummyJobDetails";

interface ScopeTabProps {
  job: JobDetail;
}

export function ScopeTab({ job }: ScopeTabProps) {
  const handleAISuggest = () => {
    toast({ title: "Coming soon", description: "AI suggestions will be available once the backend is connected." });
  };

  const displayDescription = job.description;

  return (
    <div className="space-y-3">
      {/* Job Description / Scope */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Job Scope</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleAISuggest}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Suggest
          </Button>
        </CardHeader>
        <CardContent>
          {aiDescription && (
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">AI-generated description</span>
            </div>
          )}
          <div className="text-sm text-card-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {displayDescription || "No scope description available. Tap AI Suggest to generate one."}
            </ReactMarkdown>
          </div>
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
