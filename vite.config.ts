import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const staticDirectoryIndex = (): Plugin => ({
  name: 'static-directory-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url) {
        const qIdx = req.url.indexOf('?');
        const pathname = qIdx === -1 ? req.url : req.url.slice(0, qIdx);
        const query = qIdx === -1 ? '' : req.url.slice(qIdx);
        if (pathname.endsWith('/') && pathname !== '/') {
          const candidate = path.join(__dirname, 'public', pathname, 'index.html');
          if (fs.existsSync(candidate)) {
            req.url = pathname + 'index.html' + query;
          }
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
