  import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
  export default defineConfig({
    plugins: [svelte()],
    server: {
      preview: {
        allowedHosts: ['www.or1on.city'],
      },
    },
  })

