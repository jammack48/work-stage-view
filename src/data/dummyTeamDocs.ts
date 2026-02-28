export interface TeamDoc {
  id: string;
  name: string;
  type: "cert" | "license" | "training" | "form" | "doc";
  expiry?: string;
  status?: "valid" | "expiring" | "expired";
  uploadedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  docs: TeamDoc[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1", name: "Dave Thompson", role: "Lead Plumber", avatar: "DT",
    docs: [
      { id: "d1", name: "Plumbing License", type: "license", expiry: "2027-03-15", status: "valid", uploadedAt: "2024-01-10" },
      { id: "d2", name: "Gas Fitting Cert", type: "cert", expiry: "2026-06-01", status: "expiring", uploadedAt: "2023-06-01" },
      { id: "d3", name: "First Aid Certificate", type: "cert", expiry: "2026-09-20", status: "valid", uploadedAt: "2024-09-20" },
      { id: "d4", name: "H&S Induction", type: "training", uploadedAt: "2024-02-15" },
    ],
  },
  {
    id: "tm-2", name: "Mike O'Brien", role: "Electrician", avatar: "MO",
    docs: [
      { id: "d5", name: "Electrical License", type: "license", expiry: "2027-01-01", status: "valid", uploadedAt: "2024-01-01" },
      { id: "d6", name: "Working at Heights", type: "cert", expiry: "2025-12-01", status: "expired", uploadedAt: "2023-12-01" },
      { id: "d7", name: "Site Safe Passport", type: "cert", expiry: "2026-11-15", status: "valid", uploadedAt: "2024-11-15" },
    ],
  },
  {
    id: "tm-3", name: "Tama Williams", role: "Apprentice", avatar: "TW",
    docs: [
      { id: "d8", name: "Apprentice Registration", type: "doc", uploadedAt: "2024-03-01" },
      { id: "d9", name: "First Aid Certificate", type: "cert", expiry: "2026-08-10", status: "valid", uploadedAt: "2024-08-10" },
    ],
  },
  {
    id: "tm-4", name: "Lisa Chen", role: "Plumber", avatar: "LC",
    docs: [
      { id: "d10", name: "Plumbing License", type: "license", expiry: "2026-05-20", status: "expiring", uploadedAt: "2023-05-20" },
      { id: "d11", name: "Confined Spaces Cert", type: "cert", expiry: "2027-02-01", status: "valid", uploadedAt: "2025-02-01" },
      { id: "d12", name: "H&S Induction", type: "training", uploadedAt: "2024-04-10" },
    ],
  },
  {
    id: "tm-5", name: "Hemi Brown", role: "Electrician", avatar: "HB",
    docs: [
      { id: "d13", name: "Electrical License", type: "license", expiry: "2026-12-31", status: "valid", uploadedAt: "2024-01-15" },
      { id: "d14", name: "EWR Certification", type: "cert", expiry: "2025-10-01", status: "expired", uploadedAt: "2023-10-01" },
      { id: "d15", name: "Asbestos Awareness", type: "training", uploadedAt: "2024-06-20" },
      { id: "d16", name: "Site Induction Form", type: "form", uploadedAt: "2024-07-01" },
    ],
  },
];
