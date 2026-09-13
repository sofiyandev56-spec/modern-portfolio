// Shader sources import as plain strings — see the loader rules in
// next.config.ts. Picked up by tsconfig's wildcard .ts include.
declare module "*.glsl" {
  const source: string;
  export default source;
}

declare module "*.vert" {
  const source: string;
  export default source;
}

declare module "*.frag" {
  const source: string;
  export default source;
}

declare module "*.vs" {
  const source: string;
  export default source;
}

declare module "*.fs" {
  const source: string;
  export default source;
}
