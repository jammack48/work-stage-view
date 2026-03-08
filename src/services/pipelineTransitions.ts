import type { Stage } from "@/data/dummyJobs";

export type PipelineEvent =
  | "move_to_quote"
  | "quote_created"
  | "quote_sent"
  | "quote_approved"
  | "job_finished"
  | "invoice_sent"
  | "invoice_paid";

const EVENT_TO_STAGE: Record<PipelineEvent, Stage> = {
  move_to_quote: "To Quote",
  quote_created: "To Quote",
  quote_sent: "Quote Sent",
  quote_approved: "Quote Accepted",
  job_finished: "To Invoice",
  invoice_sent: "Invoiced",
  invoice_paid: "Invoice Paid",
};

export function stageForPipelineEvent(event: PipelineEvent): Stage {
  return EVENT_TO_STAGE[event];
}

export type QuoteStatus = "Draft" | "Sent" | "Approved";
export type InvoiceStatus = "Draft" | "Sent" | "Paid";

export function stageFromQuoteStatus(status: QuoteStatus): Stage | null {
  if (status === "Sent") return "Quote Sent";
  if (status === "Approved") return "Quote Accepted";
  return null;
}

export function stageFromInvoiceStatus(status: InvoiceStatus): Stage | null {
  if (status === "Sent") return "Invoiced";
  if (status === "Paid") return "Invoice Paid";
  return null;
}
