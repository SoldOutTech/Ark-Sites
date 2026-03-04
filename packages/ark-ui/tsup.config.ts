import { defineConfig } from 'tsup'
import pkg from './package.json' assert { type: 'json' }
import { fas } from '@fortawesome/free-solid-svg-icons'

export default defineConfig({
  entry: ['src/**/*.ts*', 'src/index.ts'], // include all source files
  format: ['esm'], // keep ESM to support "use client"
  dts: true,
  outDir: 'dist',
  clean: true,
  jsx: 'preserve',
  splitting: false,         // Disable code splitting (optional)
  minify: false,            // Disable minification to keep output readable
  bundle: false,            // ❗️KEY: Prevents combining into one file
  external: [
    // Automatically exclude all peer dependencies
    ...Object.keys(pkg.peerDependencies || {}),

    // Explicitly exclude all next/* submodule imports like next/dynamic
    /^next\//
  ],
  esbuildOptions(options) {
    options.platform = 'node' // prevents Node from trying to resolve bare imports like 'next/*',
    options.treeShaking = false
  },
})