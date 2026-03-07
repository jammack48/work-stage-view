import { clearDemoDataset } from "@/demo/demoStorage";

export function resetDemoDataset(storage: Storage = sessionStorage) {
  clearDemoDataset(storage);
}
