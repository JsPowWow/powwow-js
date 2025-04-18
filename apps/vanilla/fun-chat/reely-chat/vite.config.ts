/// <reference types='vitest' />
import { defineConfig, ESBuildOptions } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/apps/vanilla/fun-chat/reely-chat',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md', 'netlify.toml'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../../../dist/apps/vanilla/fun-chat/reely-chat',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  } as const,
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/apps/vanilla/fun-chat/reely-chat',
      provider: 'v8' as const,
    },
  },
  esbuild: {
    jsx: 'transform',
    jsxDev: false,
    jsxImportSource: '@powwow-js/reely/jsx-runtime',
    jsxInject: `import { jsx } from '@powwow-js/reely'`,
    jsxFactory: 'jsx',
  } as ESBuildOptions,
}));
