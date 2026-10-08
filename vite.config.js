import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  // GitHub project Pages serves the app below the repository name.
  base: command === 'build' || isPreview ? '/delivery-income-app/' : '/',
}));
