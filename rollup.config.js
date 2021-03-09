import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
// import replace from '@rollup/plugin-replace';
import typescript from "rollup-plugin-typescript2";
// import { terser } from 'rollup-plugin-terser';

import pkg from "./package.json";

const extensions = [".ts", ".js"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

export default [
  // CommonJS
  {
    input: "src/index.ts",
    output: {
      file: "lib/parallel-state.js",
      format: "cjs",
      indent: false,
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        extensions,
        plugins: [
          ["@babel/plugin-transform-runtime", { version: babelRuntimeVersion }],
        ],
        babelHelpers: "runtime",
      }),
    ],
  },
  // ES
  {
    input: "src/index.ts",
    output: { file: "es/parallel-state.js", format: "es", indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            { version: babelRuntimeVersion, useESModules: true },
          ],
        ],
        babelHelpers: "runtime",
      }),
    ],
  },
  // UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/parallel-state.js',
      format: 'umd',
      name: 'Parallel State',
      indent: false,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
    ],
  },
];
