export function cleanMaterials(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}
