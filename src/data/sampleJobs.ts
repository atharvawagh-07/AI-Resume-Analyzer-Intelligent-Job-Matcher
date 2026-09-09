import { JobPosting } from '../types';

export const SAMPLE_JOBS: JobPosting[] = [
  {
    id: 'job-swe-lead',
    title: 'Lead Full Stack & Distributed Systems Engineer',
    company: 'Stripe / FinScale Technologies',
    department: 'Core Payments Platform',
    location: 'San Francisco, CA (or Remote)',
    workplaceType: 'Remote',
    seniority: 'Lead',
    minExperienceYears: 5,
    salaryRange: '$185,000 - $240,000 + Equity',
    educationRequired: 'BS/MS in Computer Science or equivalent practical experience',
    description: 'We are seeking a Lead Full Stack Engineer to spearhead our next-generation distributed transaction routing platform. You will lead architectural decisions across high-throughput Go and Node.js microservices, coordinate with React frontend platforms, and maintain 99.999% availability for critical payment rails.',
    requiredSkills: ['TypeScript', 'Go', 'React', 'Node.js', 'PostgreSQL', 'Distributed Systems', 'AWS', 'Microservices'],
    preferredSkills: ['Redis', 'Docker', 'Kubernetes', 'Terraform', 'GraphQL', 'Next.js', 'System Architecture', 'Mentorship'],
    requiredTechnologies: ['Go', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    responsibilities: [
      'Architect, implement, and maintain resilient payment microservices handling billions in volume.',
      'Lead frontend engineering initiatives in React/TypeScript to deliver real-time financial dashboards.',
      'Define database schemas, partitioning strategies, and caching topologies across PostgreSQL and Redis.',
      'Provide technical mentorship, establish best practices, and drive CI/CD and observability standards.'
    ],
    postedDate: '2 days ago'
  },
  {
    id: 'job-ml-ai',
    title: 'Senior Machine Learning Engineer (NLP & Search)',
    company: 'Anthropic / ScaleAI Partner',
    department: 'Applied AI & Information Retrieval',
    location: 'Seattle, WA (Hybrid)',
    workplaceType: 'Hybrid',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$190,000 - $255,000 + Equity',
    educationRequired: 'Master or Ph.D. in CS, ML, Computational Linguistics, or related field',
    description: 'Join our applied AI team to build vector search, semantic embeddings, and LLM orchestration pipelines. You will optimize inference workloads, build FAISS/pgvector index pipelines, and evaluate transformer model output across enterprise datasets.',
    requiredSkills: ['Python', 'PyTorch', 'Hugging Face Transformers', 'FastAPI', 'FAISS / Vector Search', 'Scikit-learn', 'NLP', 'Docker'],
    preferredSkills: ['spaCy', 'MLflow', 'vLLM', 'PostgreSQL / pgvector', 'Sentence-BERT', 'TensorRT', 'C++'],
    requiredTechnologies: ['Python', 'PyTorch', 'Transformers', 'FAISS', 'FastAPI'],
    responsibilities: [
      'Design and deploy production-grade embedding models and vector search architectures.',
      'Fine-tune state-of-the-art transformer models for document extraction, summarization, and ranking.',
      'Scale low-latency inference microservices using FastAPI, Triton, or vLLM on GPU clusters.',
      'Collaborate with product and data engineering to ensure model reproducibility and monitoring.'
    ],
    postedDate: '3 days ago'
  },
  {
    id: 'job-devops-sre',
    title: 'Senior Cloud Platform & DevOps Engineer',
    company: 'Datadog / CloudForge',
    department: 'Infrastructure & Reliability',
    location: 'Austin, TX (or Remote)',
    workplaceType: 'Remote',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$170,000 - $225,000 + Equity',
    educationRequired: 'BS in Computer Science, Engineering, or relevant technical field',
    description: 'Looking for a Senior Cloud Platform Engineer to architect multi-region Kubernetes clusters, build Infrastructure as Code modules in Terraform, and automate GitOps deployments for high-velocity engineering teams.',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Go or Python'],
    preferredSkills: ['Helm', 'Prometheus', 'Datadog', 'ArgoCD', 'PostgreSQL', 'Security Compliance'],
    requiredTechnologies: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'GitHub Actions'],
    responsibilities: [
      'Build and maintain scalable multi-region AWS and Kubernetes infrastructure.',
      'Enforce infrastructure as code best practices using Terraform and automated pull request validation.',
      'Design comprehensive monitoring, alerting, and incident response playbooks using Prometheus and Datadog.',
      'Partner with application teams to containerize workloads and streamline build pipelines.'
    ],
    postedDate: '1 week ago'
  },
  {
    id: 'job-frontend-staff',
    title: 'Staff Frontend Engineer (React & Design Systems)',
    company: 'Linear / Figma Labs',
    department: 'Product Experience',
    location: 'San Francisco, CA',
    workplaceType: 'Hybrid',
    seniority: 'Staff / Principal',
    minExperienceYears: 7,
    salaryRange: '$200,000 - $265,000 + Equity',
    educationRequired: 'Bachelor degree in relevant field or equivalent experience',
    description: 'We are seeking a Staff Frontend Engineer passionate about craft, micro-interactions, high performance web applications, and accessible design systems in React and TypeScript.',
    requiredSkills: ['React', 'TypeScript', 'Web Performance', 'Design Systems', 'Tailwind CSS', 'Next.js'],
    preferredSkills: ['GraphQL', 'WebSockets', 'Canvas / WebGL', 'State Machines', 'Accessibility (a11y)'],
    requiredTechnologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    responsibilities: [
      'Champion user experience, performance budgets, and 60fps interaction benchmarks across web products.',
      'Build and evolve our universal design system used across 12+ product applications.',
      'Partner closely with product design, research, and engineering leadership on roadmap execution.'
    ],
    postedDate: '5 days ago'
  }
];
