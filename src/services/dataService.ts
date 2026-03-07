import { getDemoDataset, setDemoDataset, updateDemoJobStage } from "@/services/demoService";

export const dataService = {
  getDataset: getDemoDataset,
  setDataset: setDemoDataset,
  updateJobStage: updateDemoJobStage,
};
