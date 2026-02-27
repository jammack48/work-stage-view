export interface PipelineStep {
  id: string;
  channel: "email" | "sms";
  templateId: string;
  delayValue: number;
  delayUnit: "hours" | "days";
}

export interface SequencePipeline {
  id: string;
  name: string;
  category: "quotes" | "invoices" | "reviews";
  steps: PipelineStep[];
}

export const dummySequences: SequencePipeline[] = [
  {
    id: "seq-1",
    name: "Quote Follow-up Master",
    category: "quotes",
    steps: [
      { id: "s1", channel: "sms", templateId: "s-q-1", delayValue: 1, delayUnit: "hours" },
      { id: "s2", channel: "email", templateId: "e-q-2", delayValue: 3, delayUnit: "days" },
      { id: "s3", channel: "sms", templateId: "s-q-2", delayValue: 7, delayUnit: "days" },
    ],
  },
  {
    id: "seq-2",
    name: "Text Only Chase",
    category: "quotes",
    steps: [
      { id: "s4", channel: "sms", templateId: "s-q-1", delayValue: 1, delayUnit: "hours" },
      { id: "s5", channel: "sms", templateId: "s-q-2", delayValue: 5, delayUnit: "days" },
    ],
  },
  {
    id: "seq-3",
    name: "Invoice Reminder Pipeline",
    category: "invoices",
    steps: [
      { id: "s6", channel: "email", templateId: "e-i-1", delayValue: 0, delayUnit: "hours" },
      { id: "s7", channel: "sms", templateId: "s-r-1", delayValue: 7, delayUnit: "days" },
      { id: "s8", channel: "email", templateId: "e-r-2", delayValue: 14, delayUnit: "days" },
    ],
  },
  {
    id: "seq-4",
    name: "Post-Job Review Chase",
    category: "reviews",
    steps: [
      { id: "s9", channel: "sms", templateId: "s-rv-1", delayValue: 1, delayUnit: "days" },
      { id: "s10", channel: "email", templateId: "e-rv-1", delayValue: 3, delayUnit: "days" },
    ],
  },
];
