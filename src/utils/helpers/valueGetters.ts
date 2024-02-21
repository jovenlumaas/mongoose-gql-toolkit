export const getNestedValue = <T extends Record<string, any> = Record<string, any>>(
  nestedObj: T,
  pathField: string,
) => {
  // type validations
  if (!nestedObj) {
    throw new TypeError(`argument 'nestedObj' in 'getNestedValue' function is ${nestedObj}`);
  } else if (nestedObj && typeof nestedObj !== 'object') {
    throw new TypeError(`argument 'nestedObj' in 'getNestedValue' function received a value that is not an object`);
  }
  if (!pathField) throw new TypeError(`argument 'pathField in 'getNestedValue' function is ${pathField}`);

  // execution
  let pathArr: string[] = [];
  if (pathField) pathArr = pathField.split('.'); // convert string into an array by splitting string using dot

  const result = pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObj);

  return result;
};
