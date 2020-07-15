import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import svg from "rollup-plugin-svg";

export default {
  input: "src/index.js",
  output: [
    {
      file: `dist/index.js`,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [babel({ babelHelpers: "bundled" }), json(), svg({ base64: true })],
  external: [
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/react-fontawesome",
    "google-maps-react",
    "lodash",
    "prop-types",
    "react",
    "react-dom",
    "styled-components",
    "react-ga",
  ],
};
