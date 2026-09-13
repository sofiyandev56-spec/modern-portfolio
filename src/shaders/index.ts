/**
 * Shader sources, imported as strings via the rules in next.config.ts.
 *
 * Importing here keeps the `.frag` module declaration exercised by the
 * typecheck in CI even before a shader is wired into the scene.
 */
import testFrag from "./test.frag";

export { testFrag };
