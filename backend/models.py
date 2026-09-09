"""
Pydantic Data Models for FastAPI AI Resume Analyzer and Job Matching Platform.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class SkillItem(BaseModel):
    name: str
    category: str = Field(..., description="languages, frameworks, databases, cloud_devops, tools, soft")
    is_technical: bool = True
    proficiency: Optional[str] = "proficient"
    years_experience: Optional[float] = None


class ExperienceItem(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: str
    current: bool = False
    years: float = 1.0
    bullets: List[str] = []
    metrics_detected: List[str] = []
    technologies: List[str] = []


class EducationItem(BaseModel):
    degree: str
    field: str
    institution: str
    graduation_year: str
    gpa: Optional[str] = None
    honors: Optional[str] = None


class ProjectItem(BaseModel):
    name: str
    description: str
    bullets: List[str] = []
    technologies: List[str] = []
    impact_metric: Optional[str] = None


class ParsedResume(BaseModel):
    candidate_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: Optional[str] = None
    skills: List[SkillItem] = []
    soft_skills: List[str] = []
    domain_knowledge: List[str] = []
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    certifications: List[str] = []
    total_experience_years: float = 0.0
    word_count: int = 0
    quantified_metrics_count: int = 0


class JobDescriptionInput(BaseModel):
    id: Optional[str] = "custom-job"
    title: str
    company: str
    location: Optional[str] = "Remote"
    seniority: str = "Senior"
    min_experience_years: float = 5.0
    required_skills: List[str]
    preferred_skills: List[str] = []
    required_technologies: List[str] = []
    description: str


class ScoreBreakdown(BaseModel):
    semantic_similarity: float = Field(..., description="Weight 35%")
    skill_overlap: float = Field(..., description="Weight 25%")
    required_tech: float = Field(..., description="Weight 15%")
    experience_tenure: float = Field(..., description="Weight 15%")
    education_level: float = Field(..., description="Weight 5%")
    seniority_alignment: float = Field(..., description="Weight 5%")


class JobMatchResponse(BaseModel):
    overall_match_score: int
    match_tier: str
    formula_breakdown: ScoreBreakdown
    matched_skills: List[str]
    missing_skills: List[str]
    candidate_years: float
    required_years: float
    why_matched: List[str]
    potential_gaps: List[str]
    actionable_advice: str


class AtsReport(BaseModel):
    overall_score: int
    letter_grade: str
    readability_index: float
    action_verb_score: int
    formatting_score: int
    keyword_score: int
    impact_score: int
    detected_keywords: List[str]
    missing_keywords: List[str]
    cliches_found: List[str]
    summary: str
