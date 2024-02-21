export const parseQueryFields = (info: any, { removeTypename = true } = {}) => {
  const fields = info.fieldNodes[0].selectionSet.selections;

  if (Array.isArray(fields)) {
    if (removeTypename)
      return fields.map((i) => i.name.value).filter((i) => i !== "__typename");
    return fields.map((i) => i.name.value);
  }

  return [];
};
