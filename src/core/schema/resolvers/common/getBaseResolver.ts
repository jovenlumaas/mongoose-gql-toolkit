import {
  requiresAuthValidations,
  requiresAdminValidations,
  requiresAccessValidations,
  requiresRestrictionValidations,
  createResolver,
  TAuthValidations,
  TAccessValidationTuple,
} from "./permissions";

// types

interface TAuthValidatorAuth {
  requireAuth: boolean;
  requireAccess?: never;
  requireAdmin?: never;
  requireRestriction?: never;
}

interface TAuthValidatorAccess {
  requireAuth?: never;
  requireAccess: TAccessValidationTuple[];
  requireAdmin?: never;
  requireRestriction?: never;
}

interface TAuthValidatorAdmin {
  requireAuth?: never;
  requireAccess?: never;
  requireAdmin: boolean;
  requireRestriction?: never;
}

interface TAuthValidatorRestricted {
  requireAuth?: never;
  requireAccess?: never;
  requireAdmin?: never;
  requireRestriction: boolean;
}

export type TAuthValidatorOptions =
  | TAuthValidatorRestricted
  | TAuthValidatorAuth
  | TAuthValidatorAccess
  | TAuthValidatorAdmin;

type TOptions = TAuthValidatorOptions & {
  authValidations: TAuthValidations;
};

export default function getBaseResolver({
  authValidations,
  requireAuth,
  requireAccess,
  requireAdmin,
  requireRestriction,
}: TOptions) {
  if (requireAuth) return requiresAuthValidations(authValidations);

  if (requireAccess)
    return requiresAccessValidations(authValidations)(requireAccess);

  if (requireAdmin) return requiresAdminValidations(authValidations);

  if (requireRestriction)
    return requiresRestrictionValidations(authValidations);

  return { createResolver };
}
