export interface BuildDomain {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  capabilities: string[];
  metricsText: string;
}

export const buildDomains: BuildDomain[] = [
  {
    number: "01",
    title: "ARTIFICIAL INTELLIGENCE",
    subtitle: "Autonomous Decision & Reasoning Architectures",
    description: "Architecting goal-oriented agentic workflows, deterministic state machines, and heuristic decision frameworks designed to execute complex computational sequences autonomously.",
    technologies: ["State Space Models", "Search & Planning", "Autonomous Agents", "Reinforcement Learning Concepts", "Graph Theory"],
    capabilities: [
      "Agentic reasoning loops with self-correction",
      "Dynamic task decomposition & plan execution",
      "Deterministic fallback policies for mission-critical reliability",
    ],
    metricsText: "DETERMINISTIC & REASONING ENGINES",
  },
  {
    number: "02",
    title: "MACHINE LEARNING",
    subtitle: "Statistical Modeling & Deep Neural Networks",
    description: "Training, fine-tuning, and evaluating supervised and unsupervised algorithms with rigorous mathematical grounding across linear algebra, calculus, and probability.",
    technologies: ["PyTorch", "Scikit-Learn", "NumPy & SciPy", "Pandas", "Matplotlib", "XGBoost"],
    capabilities: [
      "High-dimensional feature engineering & normalization",
      "Regularization, hyperparameter tuning & loss profiling",
      "Cross-validation & out-of-distribution robustness testing",
    ],
    metricsText: "MATHEMATICAL FOUNDATIONS // PYTORCH",
  },
  {
    number: "03",
    title: "GENERATIVE AI",
    subtitle: "Foundation Models, RAG & Latent Space Synthesis",
    description: "Building production-grade retrieval-augmented generation (RAG) pipelines, context-window orchestration, and prompt distillation systems for developer workflows.",
    technologies: ["LLM Orchestration", "Vector Databases", "Prompt Engineering", "Embeddings Space", "LangChain / LlamaIndex"],
    capabilities: [
      "Context-dense semantic indexing and hybrid retrieval",
      "Structured JSON schema extraction from unstructured text",
      "Multi-turn conversational memory with persistent session caching",
    ],
    metricsText: "HIGH-RECALL CONTEXT RETRIEVAL",
  },
  {
    number: "04",
    title: "COMPUTER VISION",
    subtitle: "Real-Time Spatial Perception & Telemetry",
    description: "Deploying high-speed pixel processing pipelines, facial landmark tracking, object classification, and frame-by-frame geometry analysis on live video streams.",
    technologies: ["OpenCV", "MediaPipe", "YOLO Architecture", "Facial Landmark Mesh", "Dlib", "PIL / Scikit-Image"],
    capabilities: [
      "Sub-20ms facial landmark regression and ocular aspect ratio calculation",
      "Bounding box tracking across variable illumination & occlusion",
      "Morphological transforms and real-time edge contours",
    ],
    metricsText: "< 18MS INFERENCE // 60 FPS STREAM",
  },
  {
    number: "05",
    title: "IoT / EDGE SYSTEMS",
    subtitle: "Embedded Silicon & Sensor Telemetry",
    description: "Bridging neural inference directly to microcontrollers and single-board computers (ESP32, Raspberry Pi, Jetson) with low power draw and zero cloud latency.",
    technologies: ["ESP32 / ESP32-CAM", "Raspberry Pi", "NVIDIA Jetson", "MQTT Protocol", "CAN-Bus", "C++ / MicroPython"],
    capabilities: [
      "Hardware interrupt handlers for millisecond alarm actuation",
      "Edge-to-cloud bidirectional messaging over MQTT and WebSockets",
      "Thermal and power budgeting on embedded ARM cores",
    ],
    metricsText: "ZERO-CLOUD EDGE AUTONOMY",
  },
  {
    number: "06",
    title: "SOFTWARE",
    subtitle: "High-Throughput Full-Stack Infrastructure",
    description: "Writing performant, typed codebases using modern Next.js App Router, TypeScript, and microservice APIs with ruthless attention to latency, ergonomics, and aesthetics.",
    technologies: ["TypeScript", "Next.js App Router", "React 19", "Tailwind CSS", "Node.js", "REST / GraphQL", "WebGL / Three.js"],
    capabilities: [
      "Client-side 60 FPS WebGL shader & 3D canvas orchestration",
      "Strict end-to-end type safety with zero runtime surprises",
      "Server-rendered static optimization and edge caching",
    ],
    metricsText: "60 FPS FLUID RENDER PIPELINE",
  },
];
