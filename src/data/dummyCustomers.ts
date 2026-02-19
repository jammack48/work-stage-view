export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  jobs: number;
  status: "active" | "leads" | "archived";
  totalSpend: number;
  notes: string[];
  contacts: { name: string; role: string; phone: string; email: string }[];
  jobHistory: { id: string; name: string; value: number; stage: string; date: string }[];
}

export const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: 1, name: "Dave Thompson", phone: "021 555 1234", email: "dave@example.com",
    address: "12 Queen St, Auckland", jobs: 3, status: "active", totalSpend: 12400,
    notes: ["Prefers morning appointments", "Has a dog - keep gate closed", "Referred by Sarah Mitchell"],
    contacts: [
      { name: "Dave Thompson", role: "Owner", phone: "021 555 1234", email: "dave@example.com" },
      { name: "Karen Thompson", role: "Partner", phone: "021 555 1235", email: "karen@example.com" },
    ],
    jobHistory: [
      { id: "TB-0101", name: "Hot Water Cylinder Replace", value: 4200, stage: "Invoice Paid", date: "2025-11-15" },
      { id: "TB-0301", name: "Switchboard Upgrade", value: 3800, stage: "In Progress", date: "2026-01-20" },
      { id: "TB-0501", name: "EV Charger Install", value: 4400, stage: "Quote Sent", date: "2026-02-10" },
    ],
  },
  {
    id: 2, name: "Sarah Mitchell", phone: "027 555 5678", email: "sarah@example.com",
    address: "45 Cuba St, Wellington", jobs: 5, status: "active", totalSpend: 28500,
    notes: ["Key account - high-value property portfolio", "Pays promptly"],
    contacts: [
      { name: "Sarah Mitchell", role: "Property Manager", phone: "027 555 5678", email: "sarah@example.com" },
      { name: "Tom Mitchell", role: "Property Owner", phone: "027 555 5679", email: "tom@mitchell.co.nz" },
    ],
    jobHistory: [
      { id: "TB-0102", name: "Bathroom Reno", value: 8500, stage: "Invoice Paid", date: "2025-08-01" },
      { id: "TB-0202", name: "Kitchen Plumbing", value: 6200, stage: "Invoice Paid", date: "2025-10-12" },
      { id: "TB-0302", name: "Heat Pump Install", value: 5800, stage: "In Progress", date: "2026-01-05" },
      { id: "TB-0402", name: "Roof Repair", value: 4500, stage: "To Invoice", date: "2026-02-01" },
      { id: "TB-0502", name: "Deck Lighting", value: 3500, stage: "Lead", date: "2026-02-15" },
    ],
  },
  {
    id: 3, name: "Mike O'Brien", phone: "022 555 9012", email: "mike@example.com",
    address: "8 Riccarton Rd, Christchurch", jobs: 1, status: "leads", totalSpend: 0,
    notes: ["Enquired about full house rewire", "Budget conscious"],
    contacts: [{ name: "Mike O'Brien", role: "Homeowner", phone: "022 555 9012", email: "mike@example.com" }],
    jobHistory: [{ id: "TB-0103", name: "Rewire", value: 12000, stage: "Lead", date: "2026-02-18" }],
  },
  {
    id: 4, name: "Jenny Wu", phone: "021 555 3456", email: "jenny@example.com",
    address: "23 Devonport Rd, Tauranga", jobs: 0, status: "leads", totalSpend: 0,
    notes: ["New build project — wants full electrical and plumbing"],
    contacts: [{ name: "Jenny Wu", role: "Homeowner", phone: "021 555 3456", email: "jenny@example.com" }],
    jobHistory: [],
  },
  {
    id: 5, name: "Rangi Patel", phone: "027 555 7890", email: "rangi@example.com",
    address: "67 Colombo St, Christchurch", jobs: 8, status: "active", totalSpend: 45200,
    notes: ["Commercial client — multi-site", "Invoices through Xero", "30-day payment terms agreed"],
    contacts: [
      { name: "Rangi Patel", role: "Director", phone: "027 555 7890", email: "rangi@example.com" },
      { name: "Sita Patel", role: "Accounts", phone: "027 555 7891", email: "accounts@patel.co.nz" },
    ],
    jobHistory: [
      { id: "TB-0105", name: "Solar Panel Install", value: 15000, stage: "Invoice Paid", date: "2025-06-20" },
      { id: "TB-0205", name: "Gas Fitting", value: 3200, stage: "Invoice Paid", date: "2025-09-10" },
      { id: "TB-0305", name: "Smoke Alarm Compliance", value: 2800, stage: "In Progress", date: "2026-01-15" },
    ],
  },
  {
    id: 6, name: "Tama Williams", phone: "022 555 2345", email: "tama@example.com",
    address: "15 Molesworth St, Wellington", jobs: 2, status: "archived", totalSpend: 3400,
    notes: ["Moved to Hamilton — archived"],
    contacts: [{ name: "Tama Williams", role: "Homeowner", phone: "022 555 2345", email: "tama@example.com" }],
    jobHistory: [
      { id: "TB-0106", name: "Blocked Drain", value: 1800, stage: "Invoice Paid", date: "2025-03-15" },
      { id: "TB-0206", name: "Tapware Replace", value: 1600, stage: "Invoice Paid", date: "2025-05-20" },
    ],
  },
  {
    id: 7, name: "Lisa Chen", phone: "021 555 6789", email: "lisa@example.com",
    address: "90 Ponsonby Rd, Auckland", jobs: 4, status: "active", totalSpend: 19800,
    notes: ["Renovation specialist — ongoing relationship", "Prefers text over calls"],
    contacts: [
      { name: "Lisa Chen", role: "Homeowner", phone: "021 555 6789", email: "lisa@example.com" },
      { name: "James Chen", role: "Partner", phone: "021 555 6780", email: "james@example.com" },
    ],
    jobHistory: [
      { id: "TB-0107", name: "Underfloor Heating", value: 7500, stage: "Invoice Paid", date: "2025-07-10" },
      { id: "TB-0207", name: "Shower Install", value: 4300, stage: "Invoice Paid", date: "2025-11-01" },
      { id: "TB-0307", name: "Rangehood Vent", value: 3500, stage: "To Invoice", date: "2026-01-28" },
      { id: "TB-0407", name: "Leak Detection", value: 4500, stage: "Quote Sent", date: "2026-02-12" },
    ],
  },
  {
    id: 8, name: "Hemi Brown", phone: "027 555 0123", email: "hemi@example.com",
    address: "33 Cameron Rd, Tauranga", jobs: 0, status: "leads", totalSpend: 0,
    notes: ["Interested in spouting repair after storm damage"],
    contacts: [{ name: "Hemi Brown", role: "Homeowner", phone: "027 555 0123", email: "hemi@example.com" }],
    jobHistory: [],
  },
];

export function getCustomer(id: number): Customer | undefined {
  return DUMMY_CUSTOMERS.find((c) => c.id === id);
}
