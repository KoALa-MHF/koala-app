import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3333/graphql',
  documents: 'apps/koala-frontend/src/app/graphql/*.ts',
  generates: {
    'apps/koala-frontend/src/app/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        addExplicitOverride: true,
      },
    },
  },
};

export default config;
