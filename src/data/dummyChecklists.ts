export interface ChecklistItem {
  id: string;
  label: string;
  mandatory: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  category: "arrival" | "completion" | "both";
  items: ChecklistItem[];
}

export interface CompletedChecklist {
  templateId: string;
  templateName: string;
  category: "arrival" | "completion" | "both";
  completedAt: string;
  items: { label: string; checked: boolean }[];
}

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: "cl-1",
    name: "Site Safety Arrival Checklist",
    category: "arrival",
    items: [
      { id: "cl1-1", label: "PPE worn (hard hat, hi-vis, boots)", mandatory: true },
      { id: "cl1-2", label: "Site hazards identified", mandatory: true },
      { id: "cl1-3", label: "Work area barricaded / secured", mandatory: true },
      { id: "cl1-4", label: "Tools and equipment inspected", mandatory: true },
      { id: "cl1-5", label: "Emergency exits identified", mandatory: false },
      { id: "cl1-6", label: "Client notified of arrival", mandatory: false },
    ],
  },
  {
    id: "cl-2",
    name: "Vehicle & Equipment Check",
    category: "arrival",
    items: [
      { id: "cl2-1", label: "Vehicle condition checked", mandatory: true },
      { id: "cl2-2", label: "Tools accounted for", mandatory: true },
      { id: "cl2-3", label: "Materials loaded correctly", mandatory: true },
      { id: "cl2-4", label: "First aid kit present", mandatory: true },
      { id: "cl2-5", label: "Fire extinguisher accessible", mandatory: false },
    ],
  },
  {
    id: "cl-3",
    name: "Switchboard Completion Checklist",
    category: "completion",
    items: [
      { id: "cl3-1", label: "All circuits tested", mandatory: true },
      { id: "cl3-2", label: "Fire sealant applied", mandatory: true },
      { id: "cl3-3", label: "No gaps in enclosure", mandatory: true },
      { id: "cl3-4", label: "Labels attached and correct", mandatory: true },
      { id: "cl3-5", label: "Clean up completed", mandatory: true },
      { id: "cl3-6", label: "RCD tested and operational", mandatory: true },
      { id: "cl3-7", label: "Photos taken of finished work", mandatory: false },
    ],
  },
  {
    id: "cl-4",
    name: "General Completion Checklist",
    category: "completion",
    items: [
      { id: "cl4-1", label: "Work completed as per scope", mandatory: true },
      { id: "cl4-2", label: "Area cleaned up", mandatory: true },
      { id: "cl4-3", label: "Customer walked through work", mandatory: false },
      { id: "cl4-4", label: "Tools packed away", mandatory: true },
      { id: "cl4-5", label: "No damage to property", mandatory: true },
    ],
  },
  {
    id: "cl-5",
    name: "Hot Works Checklist",
    category: "both",
    items: [
      { id: "cl5-1", label: "Fire watch in place", mandatory: true },
      { id: "cl5-2", label: "Combustibles cleared (10m radius)", mandatory: true },
      { id: "cl5-3", label: "Fire extinguisher on hand", mandatory: true },
      { id: "cl5-4", label: "Permit obtained", mandatory: true },
      { id: "cl5-5", label: "Area inspected after work", mandatory: true },
    ],
  },
  {
    id: "cl-6",
    name: "Confined Space Entry",
    category: "both",
    items: [
      { id: "cl6-1", label: "Atmosphere tested", mandatory: true },
      { id: "cl6-2", label: "Rescue plan in place", mandatory: true },
      { id: "cl6-3", label: "Standby person assigned", mandatory: true },
      { id: "cl6-4", label: "Permit signed", mandatory: true },
      { id: "cl6-5", label: "Communication system tested", mandatory: true },
      { id: "cl6-6", label: "Ventilation adequate", mandatory: true },
    ],
  },
];
