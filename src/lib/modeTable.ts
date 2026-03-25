export function getTable(base: string, isDemo: boolean): string {
  return isDemo ? `${base}_demo` : `${base}_prod`;
}
