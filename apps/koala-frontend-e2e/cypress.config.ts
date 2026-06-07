import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    env: {
      graphqlUrl: 'http://localhost:4200/graphql',
    },
    setupNodeEvents(on) {
      on('task', {
        generateAuthToken(userId: number) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const jwt = require('jsonwebtoken');
          return jwt.sign({ sub: userId }, 'ThisIsASecret', { expiresIn: '1d' });
        },
      });
    },
  },
});
