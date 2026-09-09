export type SkillCategory = 'languages' | 'frameworks' | 'databases' | 'cloud_devops' | 'tools' | 'methodologies';

export interface ExtractedSkill {
  name: string;
  category: SkillCategory;
  isTechnical: boolean;
  proficiency?: 'expert' | 'proficient' | 'familiar';
  yearsExperience?: number;
  sourceContext?: string; // Where in resume it was found
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  years: number;
  bullets: string[];
  metricsDetected: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  technologies: string[];
  link?: string;
  impactMetric?: string;
}

export interface ResumeData {
  id: string;
  fileName: string;
  fileSize?: string;
  uploadDate: string;
  rawText: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    title?: string;
    summary?: string;
  };
  skills: {
    technical: ExtractedSkill[];
    soft: string[];
    domain: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  stats: {
    wordCount: number;
    readingTimeMinutes: number;
    totalExperienceYears: number;
    bulletCount: number;
    metricsCount: number;
  };
}

export interface AtsCategoryScore {
  score: number; // 0 - 100
  weight: number; // percentage
  status: 'passed' | 'warning' | 'critical';
  title: string;
  findings: string[];
  recommendations: string[];
}

export interface AtsAnalysis {
  overallScore: number; // 0 - 100
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  readabilityScore: number; // 0 - 100
  actionVerbStrength: number; // 0 - 100
  categories: {
    formatting: AtsCategoryScore;
    keywordOptimization: AtsCategoryScore;
    sectionStructure: AtsCategoryScore;
    quantifiableImpact: AtsCategoryScore;
    contactAndProfiles: AtsCategoryScore;
    brevityAndLength: AtsCategoryScore;
  };
  detectedKeywords: string[];
  missingCriticalKeywords: string[];
  clichesAndBuzzwords: string[];
  parserSummary: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  seniority: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Staff / Principal';
  minExperienceYears: number;
  salaryRange: string;
  educationRequired: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredTechnologies: string[];
  responsibilities: string[];
  postedDate: string;
}

export interface JobMatchBreakdown {
  semanticSimilarityScore: number; // weight 35%
  skillOverlapScore: number;       // weight 25%
  experienceScore: number;         // weight 15%
  requiredTechScore: number;       // weight 15%
  educationScore: number;          // weight 5%
  seniorityScore: number;          // weight 5%
}

export interface JobMatchResult {
  job: JobPosting;
  overallMatchScore: number; // 0 - 100
  matchLevel: 'Exceptional' | 'Strong Match' | 'Moderate Match' | 'Growth Opportunity' | 'Low Fit';
  formulaBreakdown: JobMatchBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  experienceComparison: {
    candidateYears: number;
    requiredYears: number;
    difference: number;
    status: 'exceeds' | 'meets' | 'below';
  };
  explainableReasoning: {
    whyYouMatched: string[];
    potentialGaps: string[];
    keyDifferentiators: string[];
    actionableAdvice: string;
  };
}

export interface BulletImprovement {
  id: string;
  originalBullet: string;
  improvedBullet: string;
  framework: 'Google XYZ Formula' | 'CAR (Context-Action-Result)' | 'STAR Impact';
  improvementsApplied: string[];
  metricAdded: string;
  roleContext: string;
  isAiGenerated: true;
}

export interface LearningMilestone {
  phase: string;
  duration: string;
  focusArea: string;
  skillsToAcquire: string[];
  recommendedProject: {
    title: string;
    description: string;
    deliverable: string;
    techStack: string[];
  };
  curatedResources: {
    title: string;
    platform: string;
    type: 'Course' | 'Documentation' | 'Hands-on Lab' | 'Book';
    url?: string;
  }[];
}

export interface InterviewPrepQuestion {
  id: string;
  category: 'Technical Deep-Dive' | 'System Architecture' | 'Behavioral & STAR' | 'Resume Cross-Exam';
  question: string;
  contextOnYourResume: string;
  idealAnswerFramework: string;
  keyPointsToHighlight: string[];
  modelAnswerOutline: string;
}

export interface CareerRoadmap {
  targetRole: string;
  currentMatchPercentage: number;
  estimatedTimeToReady: string;
  keySkillGaps: string[];
  milestones: LearningMilestone[];
  interviewPrep: InterviewPrepQuestion[];
}

export interface FormulaWeights {
  semantic: number;
  skills: number;
  tech: number;
  experience: number;
  education: number;
  seniority: number;
}

export interface RecruiterCandidateFit {
  resume: ResumeData;
  matchScore: number;
  atsScore: number;
  rank: number;
  status: 'Shortlisted' | 'Under Review' | 'Strong Fit' | 'Missing Prerequisites';
  matchedSkills: string[];
  missingSkills: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  avatarInitials: string;
  resumesCount: number;
  activeMatches: number;
}
