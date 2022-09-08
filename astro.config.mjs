import { defineConfig } from 'astro/config';

import path from 'node:path'

// https://astro.build/config
export default defineConfig({
    vite: {
        resolve: {
            alias: {
                '@components': path.resolve('.', 'src/components/'),
                '@layouts': path.resolve('.', 'src/layouts/'),
            }
        }
    }
});
