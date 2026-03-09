export interface MessageTemplate {
  id: string;
  name: string;
  category: "quotes" | "invoices" | "reminders" | "services" | "reviews";
  channel: "email" | "sms";
  subject?: string;
  body: string;
  timing: "immediately" | "after_1_day" | "after_3_days" | "after_7_days" | "after_14_days" | "after_30_days";
  isActive: boolean;
}

export const TIMING_LABELS: Record<MessageTemplate["timing"], string> = {
  immediately: "Immediately",
  after_1_day: "After 1 day",
  after_3_days: "After 3 days",
  after_7_days: "After 7 days",
  after_14_days: "After 14 days",
  after_30_days: "After 30 days",
};

export const TEMPLATE_VARIABLES = [
  "{{customer_name}}",
  "{{business_name}}",
  "{{quote_total}}",
  "{{invoice_number}}",
  "{{invoice_total}}",
  "{{due_date}}",
  "{{job_address}}",
  "{{review_link}}",
  "{{service_date}}",
  "{{service_type}}",
];

export const dummyTemplates: MessageTemplate[] = [
  // EMAIL — Quotes
  { id: "e-q-1", name: "Quote Ready", category: "quotes", channel: "email", subject: "Your quote from {{business_name}} is ready", body: "Hi {{customer_name}},\n\nThanks for getting in touch. Please find your quote for ${{quote_total}} attached.\n\nLet us know if you have any questions.\n\nCheers,\n{{business_name}}", timing: "immediately", isActive: true },
  { id: "e-q-2", name: "Quote Follow-up", category: "quotes", channel: "email", subject: "Following up on your quote", body: "Hi {{customer_name}},\n\nJust checking in to see if you had any questions about the quote we sent through.\n\nHappy to chat anytime.\n\nCheers,\n{{business_name}}", timing: "after_3_days", isActive: true },

  // EMAIL — Invoices
  { id: "e-i-1", name: "Invoice Sent", category: "invoices", channel: "email", subject: "Invoice #{{invoice_number}} from {{business_name}}", body: "Hi {{customer_name}},\n\nPlease find invoice #{{invoice_number}} for ${{invoice_total}} attached. Payment is due by {{due_date}}.\n\nThanks,\n{{business_name}}", timing: "immediately", isActive: true },
  { id: "e-i-2", name: "Payment Received", category: "invoices", channel: "email", subject: "Payment received — thank you!", body: "Hi {{customer_name}},\n\nWe've received your payment for invoice #{{invoice_number}}. Thanks for your prompt payment!\n\nCheers,\n{{business_name}}", timing: "immediately", isActive: true },

  // EMAIL — Reminders
  { id: "e-r-1", name: "7-Day Overdue", category: "reminders", channel: "email", subject: "Friendly reminder: Invoice #{{invoice_number}} is overdue", body: "Hi {{customer_name}},\n\nJust a friendly reminder that invoice #{{invoice_number}} for ${{invoice_total}} was due on {{due_date}}.\n\nPlease let us know if there are any issues.\n\nThanks,\n{{business_name}}", timing: "after_7_days", isActive: true },
  { id: "e-r-2", name: "14-Day Overdue", category: "reminders", channel: "email", subject: "Second reminder: Invoice #{{invoice_number}}", body: "Hi {{customer_name}},\n\nThis is a second reminder that invoice #{{invoice_number}} for ${{invoice_total}} remains unpaid. It was due on {{due_date}}.\n\nPlease arrange payment at your earliest convenience.\n\nThanks,\n{{business_name}}", timing: "after_14_days", isActive: true },
  { id: "e-r-3", name: "30-Day Overdue", category: "reminders", channel: "email", subject: "Final notice: Invoice #{{invoice_number}}", body: "Hi {{customer_name}},\n\nInvoice #{{invoice_number}} for ${{invoice_total}} is now 30 days overdue.\n\nPlease contact us to arrange payment.\n\nRegards,\n{{business_name}}", timing: "after_30_days", isActive: false },

  // EMAIL — Services
  { id: "e-s-1", name: "Service Booking Confirmation", category: "services", channel: "email", subject: "Your booking is confirmed — {{service_date}}", body: "Hi {{customer_name}},\n\nYour service has been booked for {{service_date}} at {{job_address}}.\n\nSee you then!\n\n{{business_name}}", timing: "immediately", isActive: true },
  { id: "e-s-2", name: "Service Reminder", category: "services", channel: "email", subject: "Reminder: We're coming tomorrow", body: "Hi {{customer_name}},\n\nJust a reminder that we'll be at {{job_address}} tomorrow for your scheduled service.\n\nSee you then!\n\n{{business_name}}", timing: "after_1_day", isActive: true },

  // EMAIL — Reviews
  { id: "e-rv-1", name: "Review Request", category: "reviews", channel: "email", subject: "How did we do?", body: "Hi {{customer_name}},\n\nWe hope you're happy with the work we completed at {{job_address}}.\n\nWe'd really appreciate it if you could leave us a quick review:\n{{review_link}}\n\nThanks!\n{{business_name}}", timing: "after_3_days", isActive: true },

  // SMS — Quotes
  { id: "s-q-1", name: "Quote Ready SMS", category: "quotes", channel: "sms", body: "Hi {{customer_name}}, your quote for ${{quote_total}} from {{business_name}} is ready. Check your email for details!", timing: "immediately", isActive: true },
  { id: "s-q-2", name: "Quote Follow-up SMS", category: "quotes", channel: "sms", body: "Hi {{customer_name}}, just following up on the quote we sent. Any questions? Reply or call us anytime. — {{business_name}}", timing: "after_3_days", isActive: false },

  // SMS — Invoices
  { id: "s-i-1", name: "Invoice Sent SMS", category: "invoices", channel: "sms", body: "Hi {{customer_name}}, invoice #{{invoice_number}} for ${{invoice_total}} has been sent to your email. Due by {{due_date}}. — {{business_name}}", timing: "immediately", isActive: true },

  // SMS — Reminders
  { id: "s-r-1", name: "7-Day Overdue SMS", category: "reminders", channel: "sms", body: "Hi {{customer_name}}, friendly reminder that invoice #{{invoice_number}} (${{invoice_total}}) is overdue. Please arrange payment. — {{business_name}}", timing: "after_7_days", isActive: true },
  { id: "s-r-2", name: "14-Day Overdue SMS", category: "reminders", channel: "sms", body: "Hi {{customer_name}}, invoice #{{invoice_number}} is now 14 days overdue. Please contact us to arrange payment. — {{business_name}}", timing: "after_14_days", isActive: true },

  // SMS — Services
  { id: "s-s-1", name: "Booking Confirmation SMS", category: "services", channel: "sms", body: "Hi {{customer_name}}, your service at {{job_address}} is confirmed for {{service_date}}. See you then! — {{business_name}}", timing: "immediately", isActive: true },
  { id: "s-s-2", name: "On Our Way SMS", category: "services", channel: "sms", body: "Hi {{customer_name}}, we're on our way to {{job_address}} now. See you shortly! — {{business_name}}", timing: "immediately", isActive: true },

  // SMS — Reviews
  { id: "s-rv-1", name: "Review Request SMS", category: "reviews", channel: "sms", body: "Hi {{customer_name}}, hope you're happy with the job! We'd love a quick review: {{review_link}} Thanks! — {{business_name}}", timing: "after_3_days", isActive: true },

  // EMAIL — Service Reminders
  { id: "e-sr-1", name: "Service Reminder", category: "services", channel: "email", subject: "Your {{service_type}} is due for servicing", body: "Hi {{customer_name}},\n\nYour {{service_type}} at {{job_address}} is due for its scheduled service.\n\nWould you like us to book you in? Simply reply to this email or give us a call.\n\nCheers,\n{{business_name}}", timing: "immediately", isActive: true },

  // SMS — Service Reminders
  { id: "s-sr-1", name: "Service Reminder SMS", category: "services", channel: "sms", body: "Hi {{customer_name}}, your {{service_type}} service is due. Want us to book you in? Reply YES or call us. — {{business_name}}", timing: "immediately", isActive: true },
];
