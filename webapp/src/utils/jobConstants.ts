// 1) jobs/jobFormComponents/items.tsx

export const ITEM_OPTIONS = [
  { value: "Asphalt", label: "Asphalt" },
  { value: "Blue Metal 10mm", label: "Blue Metal 10mm" },
  { value: "Blue Metal 20mm", label: "Blue Metal 20mm" },
  { value: "Brick Laying Sand", label: "Brick Laying Sand" },
  { value: "Premium Garden Mix", label: "Premium Garden Mix" },
];

// 2) appbar/AppBar.tsx

export const sidebarSections = [
  {
    title: "Operate",
    items: [
      { label: "Allocation", path: "/allocations"},
      { label: "Jobs", path: "/jobs" },
      { label: "Planning", path: "", disabled: true },
      { label: "Projects", path: "", disabled: true },
      { label: "PWA", path: "/pwa" },
    ],
  },
  {
    title: "Track",
    items: [{ label: "Telematics", path: "", disabled: true }],
  },
  {
    title: "Finance",
    items: [
      { label: "Bills", path: "", disabled: true },
      { label: "Invoice", path: "", disabled: true },
      { label: "Invoice Approval", path: "", disabled: true },
      { label: "Overview", path: "", disabled: true },
    ],
  },
  {
    title: "Analyze",
    items: [
      { label: "Forms", path: "", disabled: true },
      { label: "Logged Events", path: "", disabled: true },
      { label: "Notifications", path: "", disabled: true },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Contacts", path: "", disabled: true },
      { label: "Custom Field Group", path: "/custom-field-groups" },
      { label: "Documents", path: "", disabled: true },
      { label: "Fleets", path: "", disabled: true },
      { label: "Items", path: "", disabled: true },
      { label: "License Class", path: "", disabled: true },
      { label: "Price Lists", path: "", disabled: true },
      { label: "User", path: "", disabled: true },
      { label: "Vehicle Class", path: "", disabled: true },
      { label: "Vehicles", path: "/vehicles" },
      { label: "Work Flow Categories", path: "", disabled: true },
    ],
  },
  {
    title: "Configure",
    items: [
      { label: "Custom Field Templates", path: "/custom-field-templates" },
      { label: "Document Types", path: "", disabled: true },
      { label: "Dynamic Workflow", path: "", disabled: true },
      { label: "Finance Categories", path: "", disabled: true },
      { label: "Form Templates", path: "", disabled: true },
      { label: "Invoice Templates", path: "", disabled: true },
      { label: "Logged Event Templates", path: "", disabled: true },
      { label: "Notification Topics", path: "", disabled: true },
      { label: "Policies and Procedures", path: "", disabled: true },
      { label: "POP/POD Templates", path: "", disabled: true },
      { label: "Shift Templates", path: "", disabled: true },
      { label: "Site Settings", path: "", disabled: true },
      { label: "User Groups", path: "", disabled: true },
    ],
  },
];

// 3) jobs/jobFormComponents/Documents.tsx
export const maxFileSize = 4 * 1024 * 1024; // 4 MB

export const allowedTypes = [
  ".png",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".doc",
  ".txt",
  ".csv",
  ".docx",
  ".xls",
  ".xlsx",
  ".rtf",
];

// 4) jobs/jobFormComponents/JobRoute.tsx
export const contacts = [
  {
    id: "c1",
    value: "completeConstruction",
    label: "Complete Construction Pty Ltd",
  },
  { id: "c2", value: "johnsLandscaping", label: "John's Landscaping" },
  { id: "c3", value: "cuttingEdgeQuarries", label: "Cutting Edge Quarries" },
  { id: "c4", value: "energyQuarries", label: "Energy Quarries" },
];

export const locations: Record<
  string,
  { value: string; label: string; contactId: string }
> = {
  completeConstruction: {
    value: "completeConstructionAddress",
    label: "725, Pittwater Rd, Dee Why, Sydney, 2099, NSW",
    contactId: "c1",
  },
  johnsLandscaping: {
    value: "johnsLandscapingAddress",
    label: "601, High St, Penrith, Sydney, 2750, NSW",
    contactId: "c2",
  },
  cuttingEdgeQuarries: {
    value: "cuttingEdgeQuarriesAddress",
    label: "8-10 Brown St, Newton, Sydney, 2042, NSW",
    contactId: "c3",
  },
  energyQuarriesPottsPoint: {
    value: "energyQuarriesPottsPointAddress",
    label: "50-52, Darlinghurst Rd, Potts Point, Sydney, 2011, NSW",
    contactId: "c4",
  },
  energyQuarriesGlebe: {
    value: "energyQuarriesGlebeAddress",
    label: "186, Glebe Point Rd, Glebe, Sydney, 2037, NSW",
    contactId: "c4",
  },
};
