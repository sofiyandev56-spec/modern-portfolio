export interface JourneyMilestone {
  year: string;
  stage: string;
  type: "ACTIVE FOUNDATION" | "STRATEGIC GOAL" | "LONG-TERM VISION";
  headline: string;
  description: string;
  focusAreas: string[];
  status: "In Progress" | "Upcoming" | "Target Milestone";
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    year: "2026",
    stage: "STAGE 01",
    type: "ACTIVE FOUNDATION",
    headline: "BUILDING FOUNDATIONS & EDGE ARCHITECTURES",
    description: "Pursuing B.Tech with specialization in Artificial Intelligence & Machine Learning. Mastering computer science fundamentals, data structures, linear algebra, calculus, and embedded computer vision. Built and deployed SmartDrive.",
    focusAreas: [
      "B.Tech CSE (AI & ML Specialization)",
      "Algorithms & Complexity",
      "Embedded Computer Vision (OpenCV)",
      "Python & C++ Systems Programming",
      "IoT Hardware Integration (ESP32/Jetson)",
    ],
    status: "In Progress",
  },
  {
    year: "2027",
    stage: "STAGE 02",
    type: "STRATEGIC GOAL",
    headline: "DEEPENING DEEP LEARNING & TRANSFORMER MODELS",
    description: "Systematic mastery of modern neural architectures—attention mechanisms, diffusion priors, transformer representations, and multimodal foundation models. Bridging research models to physical edge devices.",
    focusAreas: [
      "Deep Learning (PyTorch & JAX)",
      "Transformer Mechanics & Attention",
      "Multimodal Representation Learning",
      "Real-World IoT Deployments",
      "Edge Model Optimization",
    ],
    status: "Upcoming",
  },
  {
    year: "2028",
    stage: "STAGE 03",
    type: "STRATEGIC GOAL",
    headline: "ADVANCED PROJECTS, QUANTIZATION & RESEARCH",
    description: "Publishing reproducible open-source research and engineering prototypes. Exploring low-bit precision quantization (INT4/FP4), sparse attention kernels, and low-latency inference on edge silicon.",
    focusAreas: [
      "Model Quantization & Pruning",
      "Custom CUDA Kernel Optimization",
      "High-Throughput Inference Pipelines",
      "Distributed Model Parallelism",
      "Autonomous Multi-Agent Systems",
    ],
    status: "Upcoming",
  },
  {
    year: "2029",
    stage: "STAGE 04",
    type: "STRATEGIC GOAL",
    headline: "ENGINEERING INTELLIGENT SYSTEMS AT SCALE",
    description: "Architecting resilient, production-grade AI infrastructure. Deploying distributed inference clusters, automated continuous evaluation pipelines, and edge-to-cloud telemetry platforms.",
    focusAreas: [
      "Production ML Infrastructure (MLOps)",
      "Distributed Stream Telemetry",
      "Fault-Tolerant Microservices",
      "Hardware-Aware Compilation (TensorRT/ONNX)",
      "Large-Scale Autonomous Systems",
    ],
    status: "Upcoming",
  },
  {
    year: "2030",
    stage: "STAGE 05",
    type: "LONG-TERM VISION",
    headline: "FULL-FLEDGED AI/ML SYSTEMS ENGINEER",
    description: "Operating as an impactful AI/ML engineer designing cutting-edge autonomous intelligence platforms, high-performance inference engines, and impactful edge systems that transform physical industries.",
    focusAreas: [
      "Principal AI/ML Architecture",
      "High-Throughput Intelligent Edge",
      "Full-Stack Mathematical & Systems Rigor",
      "Industry-Scale Autonomous Impact",
    ],
    status: "Target Milestone",
  },
];
