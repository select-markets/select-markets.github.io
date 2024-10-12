export default function createBlobUrl(
  base64Data: string,
  mimeType: string
): string {
  if (base64Data === undefined || mimeType === undefined) return "";

  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
