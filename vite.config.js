import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // GitHub project Pages serves the app below the repository name.
  base: command === 'build' ? '/delivery-income-app/' : '/',
}));
