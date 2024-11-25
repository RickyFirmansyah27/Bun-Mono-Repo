const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * Custom ESLint configuration for Express.js project
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ["eslint:recommended", "prettier", "eslint-config-turbo"],
    plugins: ["only-warn"],
    env: {
        node: true,
        commonjs: true,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
        "dist/",
    ],
    overrides: [
        // Force ESLint to detect .tsx files
        { files: ["*.js?(x)", "*.ts?(x)"] },
        // Override for server files
        {
            files: ["server/**/*.js", "server/**/*.ts"],
            env: {
                browser: false,
                node: true,
            },
        },
    ],
};
