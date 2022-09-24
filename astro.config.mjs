import { defineConfig } from 'astro/config';
import path from 'node:path'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
    integrations: [mdx()],
    markdown: {
        shikiConfig: {
            theme: 'min-light'
        }
    },
    vite: {
        resolve: {
            alias: {
                '@components': path.resolve('.', 'src/components/'),
                '@layouts': path.resolve('.', 'src/layouts/'),
            }
        }
    }
});
