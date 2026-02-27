export interface CoverLetterTemplate {
  id: string;
  name: string;
  body: string;
}

export const coverLetterTemplates: CoverLetterTemplate[] = [
  {
    id: "professional",
    name: "Professional",
    body: `Dear {{customer_name}},

Thank you for the opportunity to provide this quotation. Please find below our detailed pricing for the work discussed at {{job_address}}.

All pricing is valid for 30 days from the date of issue. We pride ourselves on quality workmanship and look forward to working with you.

Kind regards,
{{business_name}}`,
  },
  {
    id: "friendly",
    name: "Friendly",
    body: `Hi {{customer_name}},

Great to meet you! Here's the quote for the work at {{job_address}} — I've broken it all down so you can see exactly what's included.

If you've got any questions at all, just give us a bell. We'd love to get stuck in!

Cheers,
{{business_name}}`,
  },
  {
    id: "minimal",
    name: "Minimal",
    body: `{{customer_name}},

Please see attached quote for {{job_address}}.
Total: {{quote_total}} (incl. GST)

{{business_name}}`,
  },
];
