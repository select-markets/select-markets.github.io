export default function convertToSnakeCase(str: string): string {
  if (str === undefined) return "";

  return str
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}
