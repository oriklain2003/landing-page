import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const staticDirectoryIndex = (): Plugin => ({
  name: 'static-directory-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && req.url.endsWith('/') && req.url !== '/') {
        const candidate = path.join(__dirname, 'public', req.url, 'index.html');
        if (fs.existsSync(candidate)) {
          req.url = req.url + 'index.html';
        }
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), staticDirectoryIndex()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
