"""
Pytest Unit and Integration Tests for Resume NLP and Job Matching Engine.
"""
import pytest
from backend.models import ParsedResume, SkillItem, ExperienceItem, EducationItem, JobDescriptionInput
from backend.matcher import match_resume_to_job, compute_token_similarity
from backend.pipeline import ResumePipeline


def test_compute_token_similarity():
    text_a = "Senior Software Engineer with TypeScript and React experience"
    text_b = "Looking for Senior Engineer with React and TypeScript skills"
    sim = compute_token_similarity(text_a, text_b)
    assert sim > 0.6, f"Expected high similarity, got {sim}"


def test_matcher_scoring_formula():
    resume = ParsedResume(
        candidate_name="Alex Rivera",
        skills=[
            SkillItem(name="TypeScript", category="languages"),
            SkillItem(name="React", category="frameworks"),
            SkillItem(name="Go", category="languages"),
            SkillItem(name="PostgreSQL", category="databases"),
            SkillItem(name="AWS", category="cloud_devops")
        ],
        soft_skills=["Leadership", "Mentorship"],
        total_experience_years=6.0,
        word_count=450,
        quantified_metrics_count=8
    )

    job = JobDescriptionInput(
        title="Lead Full Stack Engineer",
        company="TechCorp",
        seniority="Lead",
        min_experience_years=5.0,
        required_skills=["TypeScript", "React", "Go", "PostgreSQL"],
        required_technologies=["TypeScript", "Go"],
        description="Lead distributed microservices using Go and React."
    )

    match = match_resume_to_job(resume, job)
    assert match.overall_match_score >= 80, f"Expected high match, got {match.overall_match_score}"
    assert "TypeScript" in match.matched_skills
    assert match.formula_breakdown.skill_overlap == 100
    assert match.formula_breakdown.experience_tenure == 100


def test_pipeline_contact_extraction():
    pipeline = ResumePipeline()
    sample_text = """John Doe
john.doe@enterprise.com | (555) 123-4567 | linkedin.com/in/johndoe
Experienced Python developer with 4 years of AWS experience.
Reduced API latency by 45% using Redis.
"""
    parsed = pipeline.parse(sample_text)
    assert parsed.email == "john.doe@enterprise.com"
    assert parsed.phone == "(555) 123-4567"
    assert parsed.quantified_metrics_count >= 1
