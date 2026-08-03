import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    allowCypressEnv: false,
    supportFile: 'support/e2e.ts',
  },
});