import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import tailwind from '@astrojs/tailwind';
import pagefind from "astro-pagefind";
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap(), tailwind(), partytown(), pagefind(), compress()],
});