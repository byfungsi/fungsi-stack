# Fungsi Stack

This is official monorepo starter created by Fungsi. currently still in alpha.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: an express js api
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a library for putting reusable uis, shadcn ui already setup
- `@repo/database`: database management using drizzle
- `@repo/validator`: a library for putting zod based schema/DTO that should be able to be used in backend / frontend
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- Vitest for testing

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```
