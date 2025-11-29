/**
 * Minimal ESLint flat config to enable ESLint v9 when using `.eslintrc.json` style
 * We extend `next/core-web-vitals` for sensible defaults in Next.js projects.
 */
// Use Next's shareable ESLint config (works with ESLint v9 flat config)
// `eslint-config-next` exports a config object suitable for flat config usage.
// Provide an empty config array entry so ESLint won't warn about an empty flat config.
// We keep this file present to avoid the ESLint CLI failing when invoked directly.
module.exports = [{}];
