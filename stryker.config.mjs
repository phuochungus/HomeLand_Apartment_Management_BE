// @ts-check

import { debug } from 'console';

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    _comment:
        "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "jest",
    testRunner_comment:
        "Take a look at (missing 'homepage' URL in package.json) for information about the jest plugin.",
    coverageAnalysis: "perTest",
    checkers: ["typescript"],
    tsconfigFile: "tsconfig.json",

    mutator: {
        plugins: [
             '@stryker-mutator/typescript'
        ],
    },

    mutate: [
        "!src/**/*.module.ts",
        "!src/**/*.entity.ts",
        "!src/**/*.guard.ts",
        "!src/**/*.filter.ts",
        "!src/**/*.sub.ts",
    ],
    timeoutMS: 200000
    
};
export default config;
