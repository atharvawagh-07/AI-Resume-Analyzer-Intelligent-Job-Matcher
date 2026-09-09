import { ResumeData } from '../types';

export const SAMPLE_RESUMES: ResumeData[] = [
  {
    id: 'resume-swe-senior',
    fileName: 'Alex_Rivera_Senior_FullStack_Engineer.pdf',
    fileSize: '142 KB',
    uploadDate: 'Just now',
    rawText: `Alex Rivera
Senior Full Stack Engineer
San Francisco, CA | alex.rivera@email.com | (555) 382-9012 | linkedin.com/in/alex-rivera-tech | github.com/arivera-code

SUMMARY
Senior Software Engineer with 6+ years of experience designing and scaling distributed web applications and high-throughput microservices. Proven track record in TypeScript, React, Node.js, Go, and AWS cloud infrastructure. Led architecture overhaul for a core checkout pipeline processing $18M+ monthly volume while cutting p99 latency by 42%. Passionate about system resilience, developer experience, and automated CI/CD pipelines.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Go, Python, SQL, HTML5/CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, GraphQL, REST APIs
Databases: PostgreSQL, Redis, DynamoDB, MongoDB, Elasticsearch
Cloud & DevOps: AWS (ECS, Lambda, S3, CloudFront, RDS), Docker, Kubernetes, Terraform, GitHub Actions, Datadog
Methodologies: Distributed Systems, Domain-Driven Design (DDD), Microservices, Agile/Scrum, Test-Driven Development (TDD)

WORK EXPERIENCE

Senior Full Stack Software Engineer | Horizon Cloud Systems | San Francisco, CA
March 2022 - Present (2 yrs 6 mos)
- Architected and deployed an event-driven payment & invoicing microservice using Go, PostgreSQL, and AWS SQS, handling 2.4M transactions daily with 99.99% uptime.
- Optimized React and Next.js frontend state management and bundle payload, boosting Core Web Vitals and reducing initial page load time from 3.8s to 1.1s (71% improvement).
- Led a migration from monolithic EC2 instances to containerized AWS ECS with Terraform, decreasing monthly infrastructure compute spend by $24,000 (31%).
- Mentored 5 junior and mid-level engineers through code reviews, design docs, and bi-weekly architecture brown-bags, reducing pull request review turnaround time by 35%.

Full Stack Software Engineer | Lumina Data Labs | Austin, TX
July 2019 - February 2022 (2 yrs 8 mos)
- Built interactive real-time analytics dashboards using React, TypeScript, and D3.js, serving 45,000+ weekly active enterprise users.
- Designed RESTful and GraphQL backend endpoints in Node.js/Express, supporting complex multi-tenant querying and Redis caching layer that achieved 18ms average response time.
- Integrated automated end-to-end testing with Playwright and Jest, increasing overall code coverage from 54% to 88% and eliminating 40% of production regression incidents.
- Spearheaded team-wide adoption of OpenAPI/Swagger contracts, cutting backend-to-frontend integration sync cycle time by 3 business days per sprint.

Software Engineering Intern | NextGen Apps | San Jose, CA
May 2018 - August 2018 (4 mos)
- Developed responsive UI components in React and Redux for customer onboarding workflows, increasing signup conversion rate by 9.4%.
- Implemented PostgreSQL database indexing and query tuning that reduced report generation queries from 12s to 1.8s.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
GPA: 3.82 / 4.0 | Dean's Honors List | Coursework: Data Structures, Distributed Systems, Database Management, Algorithms

PROJECTS
- CloudMetrics Monitor: Open-source latency & error tracking tool built with Go, React, and WebSockets. Achieved 1,200+ GitHub stars and 8,000 monthly npm downloads.
- Distributed KV Cache: Low-latency distributed in-memory key-value store with Raft consensus in Go, supporting partition tolerance and linearizable reads.

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2023)
- HashiCorp Certified: Terraform Associate (2022)`,
    personalInfo: {
      fullName: 'Alex Rivera',
      title: 'Senior Full Stack Engineer',
      email: 'alex.rivera@email.com',
      phone: '(555) 382-9012',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alex-rivera-tech',
      github: 'github.com/arivera-code',
      summary: 'Senior Software Engineer with 6+ years of experience designing and scaling distributed web applications and high-throughput microservices. Proven track record in TypeScript, React, Node.js, Go, and AWS cloud infrastructure.'
    },
    skills: {
      technical: [
        { name: 'TypeScript', category: 'languages', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'Go', category: 'languages', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'Python', category: 'languages', isTechnical: true, proficiency: 'proficient', yearsExperience: 4 },
        { name: 'React', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 6 },
        { name: 'Next.js', category: 'frameworks', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'Node.js', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 6 },
        { name: 'PostgreSQL', category: 'databases', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'Redis', category: 'databases', isTechnical: true, proficiency: 'proficient', yearsExperience: 4 },
        { name: 'AWS', category: 'cloud_devops', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'Docker', category: 'cloud_devops', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'Kubernetes', category: 'cloud_devops', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'Terraform', category: 'cloud_devops', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'GraphQL', category: 'frameworks', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'Tailwind CSS', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 4 }
      ],
      soft: ['Technical Mentorship', 'System Architecture', 'Cross-Functional Collaboration', 'Agile Delivery', 'Code Review Leadership'],
      domain: ['Distributed Systems', 'Cloud Infrastructure', 'Fintech Payments', 'High-Throughput APIs']
    },
    experience: [
      {
        id: 'exp-1',
        title: 'Senior Full Stack Software Engineer',
        company: 'Horizon Cloud Systems',
        location: 'San Francisco, CA',
        startDate: 'March 2022',
        endDate: 'Present',
        current: true,
        years: 2.5,
        bullets: [
          'Architected and deployed an event-driven payment & invoicing microservice using Go, PostgreSQL, and AWS SQS, handling 2.4M transactions daily with 99.99% uptime.',
          'Optimized React and Next.js frontend state management and bundle payload, boosting Core Web Vitals and reducing initial page load time from 3.8s to 1.1s (71% improvement).',
          'Led a migration from monolithic EC2 instances to containerized AWS ECS with Terraform, decreasing monthly infrastructure compute spend by $24,000 (31%).',
          'Mentored 5 junior and mid-level engineers through code reviews, design docs, and bi-weekly architecture brown-bags, reducing pull request review turnaround time by 35%.'
        ],
        metricsDetected: ['2.4M transactions daily', '99.99% uptime', '3.8s to 1.1s (71% improvement)', '$24,000 monthly spend reduction (31%)', '35% turnaround reduction'],
        technologies: ['Go', 'PostgreSQL', 'AWS SQS', 'React', 'Next.js', 'AWS ECS', 'Terraform', 'Docker']
      },
      {
        id: 'exp-2',
        title: 'Full Stack Software Engineer',
        company: 'Lumina Data Labs',
        location: 'Austin, TX',
        startDate: 'July 2019',
        endDate: 'February 2022',
        current: false,
        years: 2.7,
        bullets: [
          'Built interactive real-time analytics dashboards using React, TypeScript, and D3.js, serving 45,000+ weekly active enterprise users.',
          'Designed RESTful and GraphQL backend endpoints in Node.js/Express, supporting complex multi-tenant querying and Redis caching layer that achieved 18ms average response time.',
          'Integrated automated end-to-end testing with Playwright and Jest, increasing overall code coverage from 54% to 88% and eliminating 40% of production regression incidents.',
          'Spearheaded team-wide adoption of OpenAPI/Swagger contracts, cutting backend-to-frontend integration sync cycle time by 3 business days per sprint.'
        ],
        metricsDetected: ['45,000+ weekly active users', '18ms average response time', '54% to 88% coverage', '40% regression reduction', '3 business days saved'],
        technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'Express', 'GraphQL', 'Redis', 'Jest', 'Playwright']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        graduationYear: '2019',
        gpa: '3.82',
        honors: "Dean's Honors List"
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'CloudMetrics Monitor',
        description: 'Open-source latency & error tracking tool built with Go, React, and WebSockets.',
        bullets: [
          'Architected time-series buffering with ring buffers in Go, processing 50k events/sec per node.',
          'Built clean interactive visualization interface in React with Canvas rendering for 100k data points.'
        ],
        technologies: ['Go', 'React', 'WebSockets', 'Docker'],
        impactMetric: '1,200+ GitHub stars & 8,000 monthly downloads'
      },
      {
        id: 'proj-2',
        name: 'Distributed KV Cache',
        description: 'Low-latency distributed in-memory key-value store with Raft consensus in Go.',
        bullets: ['Implemented leader election, log replication, and snapshotting guaranteeing linearizable reads.'],
        technologies: ['Go', 'gRPC', 'Distributed Consensus']
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect - Associate',
      'HashiCorp Certified: Terraform Associate'
    ],
    stats: {
      wordCount: 468,
      readingTimeMinutes: 2,
      totalExperienceYears: 5.6,
      bulletCount: 11,
      metricsCount: 11
    }
  },
  {
    id: 'resume-aiml-scientist',
    fileName: 'Dr_Elena_Rostova_Machine_Learning_Engineer.pdf',
    fileSize: '168 KB',
    uploadDate: '10 mins ago',
    rawText: `Elena Rostova, Ph.D.
Senior Machine Learning & NLP Engineer
Seattle, WA | elena.rostova@ai-research.io | (555) 914-7261 | linkedin.com/in/elena-rostova-ml | github.com/elena-ml-labs

SUMMARY
Machine Learning Engineer and Applied Researcher with 5+ years of production NLP and deep learning experience. Specializing in Large Language Models (LLMs), Sentence Transformers, Vector Search (FAISS/Milvus), and PyTorch fine-tuning. Deployed real-time semantic document search and intent classification engines serving 12M+ monthly queries at sub-50ms latency.

TECHNICAL SKILLS
Machine Learning & NLP: PyTorch, TensorFlow, Hugging Face Transformers, spaCy, Scikit-learn, LangChain, Sentence-BERT
Data & MLOps: MLflow, Kubeflow, Ray Serve, Triton Inference Server, Weights & Biases, Docker, ONNX Runtime
Languages & Systems: Python, C++, SQL, Bash, FastAPI, Flask
Databases & Vector Stores: FAISS, Pinecone, Chroma, PostgreSQL (pgvector), Redis

WORK EXPERIENCE
Senior Machine Learning Engineer | Synapse Intelligence Labs | Seattle, WA
January 2022 - Present (2 yrs 8 mos)
- Designed and productionized a multi-modal semantic search pipeline using fine-tuned Sentence-Transformers and FAISS indexing, increasing search relevance NDCG@10 by 28.4%.
- Optimized LLM inference serving on NVIDIA A100 GPUs via vLLM, TensorRT-LLM, and INT8 quantization, reducing inference cost by 62% while tripling throughput to 820 tokens/sec.
- Deployed automated drift detection and continuous evaluation pipelines using MLflow and Evidently AI, alerting team to concept drift across 4M daily interactions.

Machine Learning Researcher | Cognition Dynamics | Boston, MA
June 2019 - December 2021 (2 yrs 6 mos)
- Fine-tuned BERT and RoBERTa architectures for named entity recognition (NER) and relation extraction from biomedical texts, achieving 94.2% F1 score (surpassing baseline by 7.1%).
- Built high-performance async inference microservices using FastAPI, Celery, and Redis, scaling from 0 to 1,500 RPS during peak hospital data ingestion windows.

EDUCATION
Ph.D. in Computer Science (Focus: Deep Learning & NLP)
University of Washington | 2015 - 2019
Dissertation: "Efficient Transformer Attention for Domain-Specific Representation Learning"

Bachelor of Science in Applied Mathematics & Computer Science
Carnegie Mellon University | 2011 - 2015 | GPA: 3.91 / 4.0`,
    personalInfo: {
      fullName: 'Elena Rostova, Ph.D.',
      title: 'Senior Machine Learning & NLP Engineer',
      email: 'elena.rostova@ai-research.io',
      phone: '(555) 914-7261',
      location: 'Seattle, WA',
      linkedin: 'linkedin.com/in/elena-rostova-ml',
      github: 'github.com/elena-ml-labs',
      summary: 'Machine Learning Engineer and Applied Researcher with 5+ years of production NLP and deep learning experience. Specializing in Large Language Models (LLMs), Sentence Transformers, Vector Search (FAISS/Milvus), and PyTorch fine-tuning.'
    },
    skills: {
      technical: [
        { name: 'Python', category: 'languages', isTechnical: true, proficiency: 'expert', yearsExperience: 6 },
        { name: 'PyTorch', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'Transformers / Hugging Face', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 4 },
        { name: 'spaCy', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 4 },
        { name: 'Scikit-learn', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 5 },
        { name: 'FAISS / Vector Search', category: 'databases', isTechnical: true, proficiency: 'expert', yearsExperience: 4 },
        { name: 'FastAPI', category: 'frameworks', isTechnical: true, proficiency: 'expert', yearsExperience: 4 },
        { name: 'Docker', category: 'cloud_devops', isTechnical: true, proficiency: 'proficient', yearsExperience: 4 },
        { name: 'MLOps (MLflow, Triton)', category: 'cloud_devops', isTechnical: true, proficiency: 'proficient', yearsExperience: 3 },
        { name: 'PostgreSQL / pgvector', category: 'databases', isTechnical: true, proficiency: 'proficient', yearsExperience: 4 }
      ],
      soft: ['Research Publication', 'Scientific Rigor', 'Model Explainability', 'Cross-Disciplinary Translation'],
      domain: ['Natural Language Processing', 'Vector Search & Information Retrieval', 'Inference Optimization', 'LLM Alignment']
    },
    experience: [
      {
        id: 'exp-ml-1',
        title: 'Senior Machine Learning Engineer',
        company: 'Synapse Intelligence Labs',
        location: 'Seattle, WA',
        startDate: 'January 2022',
        endDate: 'Present',
        current: true,
        years: 2.7,
        bullets: [
          'Designed and productionized a multi-modal semantic search pipeline using fine-tuned Sentence-Transformers and FAISS indexing, increasing search relevance NDCG@10 by 28.4%.',
          'Optimized LLM inference serving on NVIDIA A100 GPUs via vLLM, TensorRT-LLM, and INT8 quantization, reducing inference cost by 62% while tripling throughput to 820 tokens/sec.',
          'Deployed automated drift detection and continuous evaluation pipelines using MLflow and Evidently AI, alerting team to concept drift across 4M daily interactions.'
        ],
        metricsDetected: ['NDCG@10 increased 28.4%', '62% inference cost reduction', '820 tokens/sec throughput (3x)', '4M daily interactions'],
        technologies: ['PyTorch', 'FAISS', 'Sentence-Transformers', 'vLLM', 'TensorRT-LLM', 'MLflow']
      }
    ],
    education: [
      {
        id: 'edu-ml-1',
        degree: 'Ph.D. in Computer Science',
        field: 'Deep Learning & NLP',
        institution: 'University of Washington',
        graduationYear: '2019'
      },
      {
        id: 'edu-ml-2',
        degree: 'Bachelor of Science',
        field: 'Applied Mathematics & CS',
        institution: 'Carnegie Mellon University',
        graduationYear: '2015',
        gpa: '3.91'
      }
    ],
    projects: [
      {
        id: 'proj-ml-1',
        name: 'FastEmbed-Vector',
        description: 'Lightweight embedding extraction toolkit for C++ and Python.',
        bullets: ['Implemented SIMD vectorized cosine and euclidean distance kernels.'],
        technologies: ['Python', 'C++', 'FAISS', 'Sentence-Transformers']
      }
    ],
    certifications: ['DeepLearning.AI Advanced MLOps Specialization'],
    stats: {
      wordCount: 390,
      readingTimeMinutes: 1.8,
      totalExperienceYears: 5.2,
      bulletCount: 6,
      metricsCount: 7
    }
  }
];
