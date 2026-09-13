import { testFrag } from "@/shaders";

// Temporary verification route: renders the imported shader source.
export default function ShaderCheck() {
  return (
    <pre id="shader-source" data-length={testFrag.length}>
      {testFrag}
    </pre>
  );
}
