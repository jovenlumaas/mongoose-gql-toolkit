// types
// import type { TModuleAccessKey, TModuleAccessLevel } from "@types";
import type { TResolverFn, TResolverContext } from "../../../../types";

export type TAuthValidations<TContext extends TResolverContext = any> = Record<
  "auth" | "access" | "admin" | "restricted",
  TResolverFn<TContext>
>;

export type TAccessValidationTuple<T = any, U = any> = [T, U];

export type TCreateResolverFn<TContext extends TResolverContext = any> = (
  resolver: TResolverFn<TContext>
) => {
  createResolver: TCreateResolverFn<TContext>;
};

export const createResolver: TCreateResolverFn = (resolver) => {
  const baseResolver = resolver as any;

  baseResolver.createResolver = (childResolver: TResolverFn) =>
    createResolver(async (source, args, context, info) => {
      await resolver(source, args, context, info);
      return childResolver(source, args, context, info);
    });

  return baseResolver;
};

export const requiresAuthValidations = (authValidations: TAuthValidations) =>
  createResolver(async (...args) => {
    await authValidations.auth(...args);
  });

export const requiresAccessValidations =
  <T = any, U = any>(authValidations: TAuthValidations) =>
  (accessValidations: TAccessValidationTuple<T, U>[]) =>
    requiresAuthValidations(authValidations).createResolver(
      async (parent, arg, ...rest) => {
        await authValidations.access(
          parent,
          { ...arg, accessValidations },
          ...rest
        );
      }
    );

export const requiresAdminValidations = (authValidations: TAuthValidations) =>
  requiresAuthValidations(authValidations).createResolver(async (...args) => {
    await authValidations.admin(...args);
  });

export const requiresRestrictionValidations = (
  authValidations: TAuthValidations
) =>
  requiresAuthValidations(authValidations).createResolver(async (...args) => {
    await authValidations.restricted(...args);
  });

export type TWithCreateResolverFn<TContext extends TResolverContext> = <
  TArgs extends object = any,
  TSource extends object = any
>(
  resolver: TResolverFn<TContext, TArgs, TSource>
) => TResolverFn<TContext, TArgs, TSource>;

export type TCreatePermissionsFn<TContext extends TResolverContext = any> = (
  authValidations: TAuthValidations
) => {
  createResolver: TWithCreateResolverFn<TContext>;

  requiresAuth: {
    createResolver: TWithCreateResolverFn<TContext>;
  };

  requiresAccess: (accessValidations: TAccessValidationTuple[]) => {
    createResolver: TWithCreateResolverFn<TContext>;
  };

  requiresAdmin: {
    createResolver: TWithCreateResolverFn<TContext>;
  };
  requiresRestriction: {
    createResolver: TWithCreateResolverFn<TContext>;
  };
};

export const createPermissions: TCreatePermissionsFn = (authValidations) =>
  ({
    createResolver,
    requiresAuth: requiresAuthValidations(authValidations),
    requiresAccess: requiresAccessValidations(authValidations),
    requiresAdmin: requiresAdminValidations(authValidations),
    requiresRestriction: requiresRestrictionValidations(authValidations),
  } as any);
