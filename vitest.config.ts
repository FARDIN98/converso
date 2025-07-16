import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vitest configuration for Next.js project
 * - Uses jsdom environment for DOM testing
 * - Configures path aliases to match Next.js setup
 * - Enables global test functions (describe, it, expect)
 * - Sets up coverage reporting
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',
    
    // Setup file for global test configuration
    setupFiles: ['./src/test/setup.ts'],
    
    // Enable global test functions without imports
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'coverage/**'
      ]
    },
    
    // Include test files
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Exclude files from testing
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage'
    ]
  },
  
  // Path resolution to match Next.js aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '~/': path.resolve(__dirname, './')
    }
  }
})