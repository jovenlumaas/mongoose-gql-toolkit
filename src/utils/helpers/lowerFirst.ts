export default function lowerFirst(str: string | undefined) {
  if (typeof str !== 'string' || str.length === 0) return '';

  return str.charAt(0).toLowerCase() + str.slice(1);
}
