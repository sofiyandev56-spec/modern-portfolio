export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  category: string;
  status: "PRODUCTION" | "IN DEVELOPMENT" | "RESEARCH / LAB";
  summary: string;
  description: string;
  technologies: string[];
  metrics?: { label: string; value: string }[];
  architecture?: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "smartdrive",
    index: "01",
    title: "SMARTDRIVE",
    tagline: "IoT-Based Driver Drowsiness Detection & Fleet Safety System",
    category: "AI / IoT / COMPUTER VISION",
    status: "PRODUCTION",
    summary: "Real-time edge computer vision pipeline detecting operator fatigue via facial landmark telemetry and EAR ratios with hardware alerting.",
    description: "An intelligent edge AI system built to prevent heavy vehicle collisions. Analyzes continuous video feeds from an infrared sensor array, calculates Eye Aspect Ratio (EAR) and mouth yawning geometry in under 18ms, and pushes instant telemetry to fleet management consoles via MQTT/CAN-bus.",
    technologies: [
      "Python",
      "OpenCV",
      "Dlib / MediaPipe",
      "IoT / ESP32-CAM",
      "Edge Computing",
      "MQTT Protocol",
      "CAN-Bus",
    ],
    metrics: [
      { label: "Inference Latency", value: "< 18ms" },
      { label: "EAR Threshold Precision", value: "98.4%" },
      { label: "Hardware Target", value: "Edge / ARM" },
      { label: "Alert Response Time", value: "0.25s" },
    ],
    architecture: [
      "Infrared IR-Cut video acquisition at 60 FPS under varying cabin lighting",
      "68-point facial landmark regression to isolate ocular and perioral geometry",
      "Adaptive EAR (Eye Aspect Ratio) calculation with dynamic fatigue thresholds",
      "Hardware interrupt triggers: High-decibel audible alarm + CAN-bus vehicle telemetry logging",
    ],
    github: "https://github.com/sofiyandev56-spec",
    featured: true,
  },
  {
    id: "spatial-ai",
    index: "02",
    title: "SPATIAL-AI",
    tagline: "Generative AI Architecture for Spatial Computing & 3D Environments",
    category: "GENERATIVE AI / RESEARCH",
    status: "IN DEVELOPMENT",
    summary: "Multi-agent LLM reasoning pipeline interfacing directly with 3D WebGL latent space manifolds and spatial user interfaces.",
    description: "Research exploration on bridging multimodal foundation models with real-time 3D spatial user interfaces. Translates natural language intent into procedural geometric transformations, real-time spatial physics, and interactive data manifolds.",
    technologies: [
      "TypeScript",
      "Three.js",
      "LLM APIs",
      "Vector Embeddings",
      "Next.js App Router",
      "WebGL Shaders",
    ],
    metrics: [
      { label: "Status", value: "Active Lab Prototype" },
      { label: "Context Window", value: "128k Tokens" },
      { label: "Rendering Engine", value: "Three.js / WebGL" },
    ],
    architecture: [
      "Multimodal prompt parsing and vector embeddings retrieval",
      "Dynamic procedural 3D scene graph compilation in WebGL",
      "Low-latency streaming response generation via Server-Sent Events",
    ],
    github: "https://github.com/sofiyandev56-spec",
    featured: false,
  },
  {
    id: "edge-tensor",
    index: "03",
    title: "EDGE-TENSOR ACCELERATOR",
    tagline: "Quantized Neural Network Inference for Low-Power Microcontrollers",
    category: "EDGE AI / HARDWARE",
    status: "IN DEVELOPMENT",
    summary: "Optimization toolchain compiling PyTorch vision models down to INT8/INT4 weights for ultra-low watt microcontroller inference.",
    description: "Developing post-training quantization and pruning routines tailored for resource-constrained ARM Cortex-M and ESP32 architectures, achieving deterministic inference without requiring cloud connectivity.",
    technologies: [
      "PyTorch",
      "TensorFlow Lite Micro",
      "INT8 Quantization",
      "C++20",
      "ARM CMSIS-NN",
    ],
    metrics: [
      { label: "Memory Footprint", value: "< 256 KB RAM" },
      { label: "Quantization Target", value: "INT8 / Fixed-Point" },
      { label: "Power Draw", value: "~1.2W" },
    ],
    architecture: [
      "Post-training weight quantization (FP32 -> INT8) with calibration datasets",
      "Pruning redundant convolutional filter weights while preserving feature recall",
      "Direct memory mapping into microcontroller flash without heap fragmentation",
    ],
    github: "https://github.com/sofiyandev56-spec",
    featured: false,
  },
  {
    id: "neural-cognition",
    index: "04",
    title: "NEURAL COGNITION EXPERIMENTS",
    tagline: "Algorithmic Research on Manifold Learning & Representation Drift",
    category: "MACHINE LEARNING / EXPERIMENT",
    status: "RESEARCH / LAB",
    summary: "Experimental testbed analyzing latent space geometry and representation stability across deep feedforward and attention layers.",
    description: "A series of computational experiments visualizing high-dimensional latent space trajectories, topological data analysis, and empirical loss landscapes under non-convex optimization.",
    technologies: [
      "Python",
      "NumPy / SciPy",
      "Matplotlib / UMAP",
      "PyTorch",
      "CUDA",
    ],
    metrics: [
      { label: "Domain", value: "Representation Learning" },
      { label: "Analysis Method", value: "UMAP / t-SNE / PCA" },
      { label: "Evaluation", value: "Metric Drift & Stability" },
    ],
    architecture: [
      "High-dimensional vector embedding extraction across intermediate hidden layers",
      "Dimensionality reduction via UMAP projection to study cluster separation",
      "Loss surface topography profiling using filter-normalized random directions",
    ],
    github: "https://github.com/sofiyandev56-spec",
    featured: false,
  },
];
