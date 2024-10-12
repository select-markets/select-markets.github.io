export default function isValidJSON(str: string): boolean {
  if (str === undefined) return false;

  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
