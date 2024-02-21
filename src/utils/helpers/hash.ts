export const encrypt = (str: string) => Buffer.from(str).toString('base64');

export const decrypt = (str: string) => Buffer.from(str, 'base64').toString('ascii');
