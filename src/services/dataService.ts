import { getDemoDataset, setDemoDataset, updateDemoJobStage, addDemoCustomer } from "@/services/demoService";

export const dataService = {
  getDataset: getDemoDataset,
  setDataset: setDemoDataset,
  updateJobStage: updateDemoJobStage,
  addCustomer: addDemoCustomer,
};
