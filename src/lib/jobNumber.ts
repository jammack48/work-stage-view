export function formatJobNumber(rawId: string, prefix = "TB"): string {
  if (!rawId) return `${prefix}-0001`;

  const numericPart = (rawId.match(/\d+/g) ?? []).join("");
  if (!numericPart) {
    return rawId.toUpperCase();
  }

  const normalizedNumber = numericPart.replace(/^0+(?=\d)/, "");
  const paddedNumber = normalizedNumber.length >= 4 ? normalizedNumber : normalizedNumber.padStart(4, "0");
  return `${prefix.toUpperCase()}-${paddedNumber}`;
}

export function formatVariationLabel(jobRef: string, variationNumber: number, prefix = "TB"): string {
  const safeNumber = Number.isFinite(variationNumber) && variationNumber > 0 ? Math.floor(variationNumber) : 1;
  return `${formatJobNumber(jobRef, prefix)}-V${safeNumber}`;
}

export function getVariationTokens(count: number): string[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => `V${index + 1}`);
}
