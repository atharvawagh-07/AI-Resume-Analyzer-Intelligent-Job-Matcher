-- Production PostgreSQL Schema with pgvector extension
-- AI Resume Analyzer & Intelligent Job Matching Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users and Auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'candidate', -- 'candidate', 'recruiter', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resumes
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512),
    raw_text TEXT NOT NULL,
    cleaned_text TEXT,
    ats_score INTEGER,
    readability_score FLOAT,
    total_experience_years FLOAT,
    embedding vector(384), -- 384-dimensional Sentence-Transformers embedding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Extracted Skills
CREATE TABLE resume_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'languages', 'frameworks', 'databases', 'cloud_devops', 'tools'
    is_technical BOOLEAN DEFAULT TRUE,
    proficiency VARCHAR(50) DEFAULT 'proficient',
    years_experience FLOAT
);

-- Job Postings
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    workplace_type VARCHAR(50) DEFAULT 'Remote',
    seniority VARCHAR(50) NOT NULL,
    min_experience_years FLOAT NOT NULL,
    salary_range VARCHAR(100),
    description TEXT NOT NULL,
    required_skills TEXT[] NOT NULL,
    preferred_skills TEXT[],
    required_technologies TEXT[],
    embedding vector(384), -- Job description semantic embedding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Matches & Scoring Audits
CREATE TABLE job_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    semantic_similarity_score FLOAT NOT NULL,
    skill_overlap_score FLOAT NOT NULL,
    tech_score FLOAT NOT NULL,
    experience_score FLOAT NOT NULL,
    education_score FLOAT NOT NULL,
    seniority_score FLOAT NOT NULL,
    matched_skills TEXT[],
    missing_skills TEXT[],
    explainable_reasoning JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast vector cosine similarity search
CREATE INDEX ON resumes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON job_postings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
