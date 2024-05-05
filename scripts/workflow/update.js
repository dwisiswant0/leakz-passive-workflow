const { $ } = require('bun');

await $`bun run ${__dirname}/uninstall.js`
await $`bun run ${__dirname}/install.js`