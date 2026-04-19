import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { hostname } from 'os';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.resolve(process.cwd(), 'wiki-cache');
const PROXY_PREFIX = '/__wiki-proxy/';

function sanitizeFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200) || 'unknown';
}

function cachePath(language: string, params: URLSearchParams): string {
  const titles = params.get('titles') ?? 'unknown';
  const prop = params.get('prop') ?? 'unknown';
  return path.join(
    CACHE_DIR,
    sanitizeFilename(language),
    `${sanitizeFilename(prop)}_${sanitizeFilename(titles)}.json`
  );
}

function wikiCachePlugin(): Plugin {
  return {
    name: 'wiki-cache',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith(PROXY_PREFIX)) {
          return next();
        }
        const url = new URL(req.url, 'http://localhost');
        const language = url.pathname.slice(PROXY_PREFIX.length).split('/')[0];
        if (!language) {
          res.statusCode = 400;
          res.end('Missing language');
          return;
        }

        const filename = cachePath(language, url.searchParams);

        try {
          const cached = await fs.readFile(filename, 'utf-8');
          res.setHeader('content-type', 'application/json; charset=utf-8');
          res.setHeader('x-wiki-cache', 'hit');
          res.end(cached);
          return;
        } catch {
          // cache miss — fall through to fetch
        }

        const wikiUrl = `https://${language}.wikipedia.org/w/api.php?${url.searchParams.toString()}`;
        try {
          const response = await fetch(wikiUrl, {
            headers: {
              'User-Agent': 'Sentence Word Search/1.0 (dev-local-cache; web@thinkinghard.com)',
              'Api-User-Agent': 'Sentence Word Search/1.0 (dev-local-cache; web@thinkinghard.com)'
            }
          });
          const body = await response.text();
          if (response.ok) {
            await fs.mkdir(path.dirname(filename), { recursive: true });
            await fs.writeFile(filename, body, 'utf-8');
          }
          res.statusCode = response.status;
          res.setHeader('content-type', response.headers.get('content-type') ?? 'application/json');
          res.setHeader('x-wiki-cache', 'miss');
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.end(String(err));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), wikiCachePlugin()],
  server: {
    host: `${hostname()}.local`,
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
