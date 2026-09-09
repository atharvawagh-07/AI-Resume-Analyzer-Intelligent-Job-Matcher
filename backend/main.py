"""
FastAPI Microservice Entrypoint for AI Resume Analyzer & Intelligent Job Matcher.
Provides REST APIs for resume parsing, ATS auditing, job vector matching, and career coaching.
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from backend.models import ParsedResume, JobDescriptionInput, JobMatchResponse, AtsReport
from backend.pipeline import ResumePipeline
from backend.matcher import match_resume_to_job

app = FastAPI(
    title="AI Resume Analyzer & Job Matching API",
    description="Production-grade FastAPI microservice featuring spaCy NER, Sentence Transformers, and transparent scoring.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = ResumePipeline()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FastAPI Resume NLP Engine",
        "pipeline_ready": True
    }


@app.post("/api/v1/resumes/parse", response_model=ParsedResume)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """Accepts PDF/DOCX/TXT file and runs full entity extraction and classification."""
    try:
        content = await file.read()
        raw_text = content.decode("utf-8", errors="ignore")
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Uploaded file is empty or unreadable")
        parsed = pipeline.parse(raw_text)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/jobs/match", response_model=JobMatchResponse)
def match_job_endpoint(resume: ParsedResume, job: JobDescriptionInput):
    """Calculates transparent multi-factor match score between candidate and job."""
    return match_resume_to_job(resume, job)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
