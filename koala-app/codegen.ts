import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3333/graphql',
  documents: 'apps/koala-frontend/src/**/*.ts',
  generates: {
    'apps/koala-frontend/src/app/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
    },
  },
};

export default config;
