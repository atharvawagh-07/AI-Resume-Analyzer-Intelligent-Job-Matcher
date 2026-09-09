# AI Resume Analyzer & Intelligent Job Matching Platform

https://ai-resume-analyzer-intelligent-job-matcher.ai.studio

A production-grade, full-stack AI Resume Analyzer, ATS Compatibility Scorer, and Semantic Job Matching Platform built with **React, TypeScript, Tailwind, FastAPI, spaCy, Sentence-Transformers, PostgreSQL (pgvector), and Gemini AI**.

---

## 🌟 Key Features

1. **Multi-Format Resume Ingestion & Parsing**:
   - Supports PDF, DOCX, TXT uploads and pre-loaded production resumes.
   - Robust section detection: Summary, Skills, Work History, Education, Projects, and Certifications.
   - High-precision entity extraction for candidate contact info, companies, job titles, and graduation dates.

2. **Skill Extraction & Taxonomy Classification**:
   - Automatic classification into **Languages**, **Frameworks**, **Databases**, **Cloud & DevOps**, **Tools**, and **Soft / Leadership Skills**.
   - Extraction of numerical context and proficiency tiers.

3. **ATS Compatibility & Resume Quality Audit**:
   - Comprehensive **0 - 100 ATS Score** across 6 weighted dimensions:
     - Formatting & Layout (15%)
     - Keyword Density & Indexability (25%)
     - Standard Section Structure (15%)
     - Quantified Impact & Metrics (20%)
     - Contact & Web Profiles (10%)
     - Vocabulary & Action Verbs (15%)
   - Automated detection of quantified metrics (percentages, dollar values, throughput) and cliché buzzwords.

4. **Intelligent Job Matching with Transparent Formula**:
   - Semantic similarity calculated between resume and job description using dense embeddings and TF-IDF cosine similarity.
   - **Formula**:
     $$\text{Score} = 0.35 \times \text{Sim}_{\text{semantic}} + 0.25 \times \text{Score}_{\text{skills}} + 0.15 \times \text{Score}_{\text{tech}} + 0.15 \times \text{Score}_{\text{exp}} + 0.05 \times \text{Score}_{\text{edu}} + 0.05 \times \text{Score}_{\text{seniority}}$$
   - **Explainable Match Reasoning**: Clear bullet points explaining "Why You Matched", "Identified Gaps", and "Actionable Strategy".

5. **AI Career Co-Pilot (Gemini API & Google XYZ Formula)**:
   - **Achievement-Oriented Bullet Rewriter**: Transforms passive duty descriptions into high-impact XYZ bullets: *"Accomplished [X] as measured by [Y], by doing [Z]"*.
   - **Personalized 12-Week Learning Roadmap**: Phase-by-phase milestones with curated project assignments and resources.
   - **Custom Interview Prep**: Technical deep-dive, system design whiteboarding, and resume cross-examination questions tailored to the candidate's exact profile.
   - **Separation of Concerns**: User-provided verified facts are explicitly distinguished from AI recommendations.

---

## 🏗️ Technical Architecture

```
[ Frontend: React 19 + Vite + TypeScript + Tailwind + Recharts ]
                             │
                             ▼ (Port 3000)
    [ Express API Layer & Server-Side Gemini AI (@google/genai) ]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
[ FastAPI + Python Microservice ]     [ PostgreSQL + pgvector ]
 (spaCy NER, Sentence-Transformers)    (Vector cosine search)
```

---

## 🚀 Quickstart & Development

### 1. Web Application (React + Express Server)
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build
```

### 2. Python FastAPI Microservice
```bash
# Navigate to backend and install requirements
pip install -r backend/requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run FastAPI server (Port 8000)
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Docker Deployment
```bash
# Start all services (Postgres + pgvector, FastAPI, React/Express)
docker-compose up --build
```

---

## 🧪 Testing

```bash
# Run backend pytest suite
pytest tests/
```
