import gql from 'graphql-tag';
import lowerFirst from 'lodash.lowerfirst';
import upperFirst from 'lodash.upperfirst';

// types
import type {
  CreatGQLResponse,
  GQLTagOptions,
  GenerateGQLTagOptions,
  TrueOrObject,
  TrueOrObjectWithReturning,
  TrueOrObjectString,
} from './__types';

/**
 * This function auto-generates gql tag for queries and mutations to be used for graphql API call.
 * Autogeneration options consist of 'list','create', 'read', 'readCache','update' and 'delete'.
 *
 * Autogeneration depends on the arguments being passed to this function:
 *  - OPTION 1 - when 'isCrud' is set to true, all the autogeneration options are generated.
 *
 *  - OPTION 2 - when 'crudOptions' is used instead of 'isCrud', you have the option to select part from the
 *    autogeneration options.
 *
 *  - OPTION 3. - when none of the OPTION 1 and OPTION 2 is selected. OPTION 3 is more flexible using 'complements'
 *    parameter, since you can provide 'names' and specify more options other than the autogeneration options.
 *
 * @returns - an object of graphql tags for queries and/or mutations.
 */
export const genGqlTags = ({
  __typename,
  pluralizedName,
  requiredFragment: reqFragment,
  optionalFragment,
  inputName: inputAlias,
  isCrud,
  crudOptions,
  mutationSelectionOptions,
  complements,
}: GQLTagOptions) => {
  let listOption: TrueOrObject | undefined;
  let readOption: TrueOrObject | undefined;
  let createOption: TrueOrObjectWithReturning | undefined;
  let updateOption: TrueOrObjectWithReturning | undefined;
  let deleteOption: TrueOrObjectString | undefined;

  if (crudOptions) {
    const { list, create, read, update, delete: remove } = crudOptions;

    listOption = list;
    createOption = create;
    readOption = read;
    updateOption = update;
    deleteOption = remove;
  }

  // OPTIONS
  const isList = isCrud ? true : listOption ? listOption : false;
  const isCreate = isCrud ? true : createOption ? createOption : false;
  const isRead = isCrud ? true : readOption ? readOption : false;
  const isUpdate = isCrud ? true : updateOption ? updateOption : false;
  const isRemove = isCrud ? true : deleteOption ? deleteOption : false;

  let isCreateReturning =
    mutationSelectionOptions && mutationSelectionOptions.create ? mutationSelectionOptions.create : false;

  let isUpdateReturning =
    mutationSelectionOptions && mutationSelectionOptions.create ? mutationSelectionOptions.update : false;

  const lowerF = lowerFirst(__typename);
  const upperF = upperFirst(__typename);
  const inputName = inputAlias ? inputAlias : `${upperF}Input`;
  const requiredFragment = `__typename 
  ${reqFragment}`;

  // DECLARE RESPONSES
  let gqlTags = {};

  // for list
  if (isList) {
    let listName: string | undefined = '';
    let listFragment = '';
    let lastChar = '';

    if (__typename) lastChar = __typename.slice(-1);

    const pluralName = `${lowerF}${lastChar === 's' ? 'es' : 's'}`;

    if (typeof isList === 'object') {
      const { name, fragment } = isList;
      listName = name;
      listFragment = fragment;
    }

    const listQryName = pluralizedName ? pluralizedName : listName ? listName : pluralName;

    const gqlList = `
      query ${listQryName} {
        ${listQryName} {
          ${requiredFragment}
          ${optionalFragment ? optionalFragment : ''}
          ${listFragment ? listFragment : ''}
        }
      }`;

    gqlTags = {
      ...gqlTags,
      list: gql`
        ${gqlList}
      `,
    };
  }

  // for read
  if (isRead) {
    let readName: string | undefined = '';
    let readFragment = '';

    if (typeof isRead === 'object') {
      const { name, fragment } = isRead;
      readName = name;
      readFragment = fragment;
    }

    const readQryName = readName ? readName : lowerF;

    const gqlRead = `
      query ${readQryName}($id: ID!) {
        ${readQryName}(id: $id) {
          ${requiredFragment}
          ${optionalFragment ? optionalFragment : ''}
          ${readFragment ? readFragment : ''}
        }
      }`;
    gqlTags = {
      ...gqlTags,
      read: gql`
        ${gqlRead}
      `,
    };
  }

  // for create
  if (isCreate) {
    let createName: string | undefined = '';
    let createFragment = '';
    let createReturning = false;

    if (typeof isCreate === 'object') {
      const { name, fragment, returning } = isCreate;
      createName = name;
      createFragment = fragment;
      createReturning = returning;
    }

    const createQryName = createName ? createName : `create${upperF}`;
    isCreateReturning = createReturning ? createReturning : isCreateReturning;

    const createResult = isCreateReturning
      ? `${createQryName}(input: $input) {
      ${requiredFragment}
      ${optionalFragment ? optionalFragment : ''}
      ${createFragment ? createFragment : ''}
    }`
      : `${createQryName}(input: $input)`;

    const gqlCreate = `
      mutation ${createQryName}($input: ${inputName}!) {
        ${createResult}
      }`;
    gqlTags = {
      ...gqlTags,
      create: gql`
        ${gqlCreate}
      `,
    };
  }

  // for update
  if (isUpdate) {
    let updateName: string | undefined = '';
    let updateFragment = '';
    let updateReturning = false;

    if (typeof isUpdate === 'object') {
      const { name, fragment, returning } = isUpdate;
      updateName = name;
      updateFragment = fragment;
      updateReturning = returning;
    }

    const updateQryName = updateName ? updateName : `update${upperF}`;
    isUpdateReturning = updateReturning ? updateReturning : isUpdateReturning;

    const updateResult = isUpdateReturning
      ? `${updateQryName}(input: $input) {
      ${requiredFragment}
      ${optionalFragment ? optionalFragment : ''}
      ${updateFragment ? updateFragment : ''}
    }`
      : `${updateQryName}(input: $input)`;

    const gqlUpdate = `
      mutation ${updateQryName}($input: ${inputName}!) {
        ${updateResult}
      }`;
    gqlTags = {
      ...gqlTags,
      update: gql`
        ${gqlUpdate}
      `,
    };
  }

  // for delete
  if (isRemove) {
    let deleteName = '';

    if (typeof isRemove === 'object') {
      const { name } = isRemove;
      deleteName = name;
    }

    const deleteQryName = deleteName ? deleteName : `delete${upperF}`;

    const gqlDelete = `
      mutation ${deleteQryName}($id: ID!) {
        ${deleteQryName}(id: $id)
      }`;

    gqlTags = {
      ...gqlTags,
      delete: gql`
        ${gqlDelete}
      `,
    };
  }

  // if additional gql-tags
  if (complements) {
    const complementKeys = Object.keys(complements);

    complementKeys.forEach((key) => {
      const complement = `
        ${complements[key]}
      `;
      gqlTags = {
        ...gqlTags,
        [key]: gql`
          ${complement}
        `,
      };
    });
  }

  return gqlTags;
};

// ************************************* CREATE GQL ********************************************* //

/**
 * This function is used for simplifying boilerplate of creating graphl-tag for queries and mutation, especially when
 * an app requires al lot of models that requires repetitive modeling for CRUD operations. To aid these CRUD boilerplates,
 * this function provides the autogeneration options that consist of 'list','create', 'read', 'readCache','update' and 'delete'.
 *
 * Autogeneration depends on the arguments being passed to this function:
 *  - Option 1 - when 'isCrud' is set to true, all the autogeneration options are generated.
 *
 *  - Option 2 - when 'crudOptions' is used instead of 'isCrud', you have the option to select part from the
 *    autogeneration options.
 *
 *  - Option 3. - when none of the Option 1 and Option 2 is selected. Option 3 is more flexible using 'complements'
 *    parameter, since you can provide 'names' and specify more options other than the autogeneration options.
 *
 * NOTE: If creating gql tag options requires nesting, you can freely provide an object with the parameters. For example,
 * {chats: {isCrud: true, ...etc}}
 *
 * @returns - an object of gql tags for queries and mutations to be used for graphql API call.
 */
const createGQL = <T extends GenerateGQLTagOptions>(objHandlers: T): CreatGQLResponse<T> => {
  let allGqlTags = {} as any;

  if (typeof objHandlers?.addRawGql === 'boolean') {
    allGqlTags = genGqlTags(objHandlers as GQLTagOptions);
  } else {
    Object.keys(objHandlers).forEach((key) => {
      const handler = objHandlers[key as keyof typeof objHandlers];
      if (handler) allGqlTags[key] = createGQL(handler as any);
    });
  }

  return allGqlTags;
};

// ************************************* MERGE GQL ********************************************* //

// ************ EXPORTS ***************//
export { createGQL };
