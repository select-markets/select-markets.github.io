export default function removeHTML(text: string): string {
  return text.replace(/<[^>]*>/g, " ");
}
