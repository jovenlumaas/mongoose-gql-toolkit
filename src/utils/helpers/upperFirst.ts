export default function upperFirst(str: string | undefined) {
  if (typeof str !== 'string' || str.length === 0) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
}
