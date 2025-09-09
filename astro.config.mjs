import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import tailwind from '@astrojs/tailwind';
import pagefind from "astro-pagefind";
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
    experimental: {
        contentIntellisense: true,
    },
    site: 'https://blog.anish7.me',
    integrations: [mdx(), sitemap(), tailwind(), partytown(), pagefind(), compress()],
});