import { JobPosting, JobMatchResult, ResumeData, JobMatchBreakdown, FormulaWeights } from '../types';

export const DEFAULT_FORMULA_WEIGHTS: FormulaWeights = {
  semantic: 35,
  skills: 25,
  tech: 15,
  experience: 15,
  education: 5,
  seniority: 5,
};

/**
 * Calculates TF-IDF style token cosine similarity between two text corpuses
 */
export function computeCosineSimilarity(textA: string, textB: string): number {
  const tokenize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  };

  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const freqA: Record<string, number> = {};
  const freqB: Record<string, number> = {};

  tokensA.forEach((t) => (freqA[t] = (freqA[t] || 0) + 1));
  tokensB.forEach((t) => (freqB[t] = (freqB[t] || 0) + 1));

  const allTokens = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  allTokens.forEach((token) => {
    const valA = freqA[token] || 0;
    const valB = freqB[token] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(Math.max(similarity, 0), 1);
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Normalizes skill strings for fuzzy matching
 */
function normalizeSkill(str: string): string {
  return str.toLowerCase().replace(/[\s\-_/.]/g, '');
}

/**
 * Transparent Multi-Factor Matching Algorithm
 * Formula:
 * Overall = (Semantic * 0.35) + (Skills * 0.25) + (Tech * 0.15) + (Experience * 0.15) + (Education * 0.05) + (Seniority * 0.05)
 */
export function calculateJobMatch(
  resume: ResumeData, 
  job: JobPosting, 
  customWeights?: FormulaWeights
): JobMatchResult {
  const candidateSkillsSet = new Set(
    resume.skills.technical.map((s) => normalizeSkill(s.name))
  );
  // Also add soft and domain skills to set
  resume.skills.soft.forEach((s) => candidateSkillsSet.add(normalizeSkill(s)));
  resume.skills.domain.forEach((s) => candidateSkillsSet.add(normalizeSkill(s)));

  // 1. Skill Overlap Score (25%)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const bonusSkills: string[] = [];

  job.requiredSkills.forEach((req) => {
    const norm = normalizeSkill(req);
    const found = Array.from(candidateSkillsSet).some((cs) => cs.includes(norm) || norm.includes(cs));
    if (found) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  job.preferredSkills.forEach((pref) => {
    const norm = normalizeSkill(pref);
    const found = Array.from(candidateSkillsSet).some((cs) => cs.includes(norm) || norm.includes(cs));
    if (found && !matchedSkills.includes(pref)) {
      bonusSkills.push(pref);
    }
  });

  const reqSkillRatio = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 1;
  const prefSkillBonus = job.preferredSkills.length > 0 ? (bonusSkills.length / job.preferredSkills.length) * 0.2 : 0;
  const skillOverlapScore = Math.min(Math.round((reqSkillRatio * 0.85 + prefSkillBonus) * 100), 100);

  // 2. Required Tech Stack Match (15%)
  let matchedTechCount = 0;
  job.requiredTechnologies.forEach((tech) => {
    const norm = normalizeSkill(tech);
    const hasTech = Array.from(candidateSkillsSet).some((cs) => cs.includes(norm) || norm.includes(cs)) ||
      resume.rawText.toLowerCase().includes(tech.toLowerCase());
    if (hasTech) matchedTechCount++;
  });
  const requiredTechScore = job.requiredTechnologies.length > 0
    ? Math.round((matchedTechCount / job.requiredTechnologies.length) * 100)
    : 100;

  // 3. Semantic Similarity Score (35%)
  const resumeCorpus = `${resume.personalInfo.title || ''} ${resume.personalInfo.summary || ''} ${resume.skills.technical.map(s => s.name).join(' ')} ${resume.experience.map(e => `${e.title} ${e.bullets.join(' ')}`).join(' ')}`;
  const jobCorpus = `${job.title} ${job.description} ${job.requiredSkills.join(' ')} ${job.responsibilities.join(' ')}`;
  const rawCosine = computeCosineSimilarity(resumeCorpus, jobCorpus);
  // Scale and calibrate cosine (typical text cosine is 0.35-0.75 for good matches)
  const semanticSimilarityScore = Math.min(Math.round(Math.pow(rawCosine, 0.75) * 125), 100);

  // 4. Experience Years Match (15%)
  const candYears = resume.stats.totalExperienceYears;
  const reqYears = job.minExperienceYears;
  let experienceScore = 100;
  let expStatus: 'exceeds' | 'meets' | 'below' = 'meets';

  if (candYears >= reqYears + 2) {
    expStatus = 'exceeds';
    experienceScore = 100;
  } else if (candYears >= reqYears) {
    expStatus = 'meets';
    experienceScore = 95;
  } else {
    expStatus = 'below';
    const deficit = reqYears - candYears;
    experienceScore = Math.max(Math.round(100 - deficit * 20), 40);
  }

  // 5. Education Match (5%)
  let educationScore = 90;
  const degreeLevels = resume.education.map(e => e.degree.toLowerCase());
  if (degreeLevels.some(d => d.includes('ph.d') || d.includes('doctor'))) {
    educationScore = 100;
  } else if (degreeLevels.some(d => d.includes('master') || d.includes('ms'))) {
    educationScore = 95;
  } else if (degreeLevels.some(d => d.includes('bachelor') || d.includes('bs'))) {
    educationScore = 90;
  } else {
    educationScore = 80;
  }

  // 6. Seniority Match (5%)
  let seniorityScore = 90;
  const candTitle = (resume.personalInfo.title || '').toLowerCase();
  const jobSeniority = job.seniority;
  if (jobSeniority === 'Lead' && (candTitle.includes('senior') || candTitle.includes('lead') || candYears >= 5)) {
    seniorityScore = 95;
  } else if (jobSeniority === 'Senior' && (candTitle.includes('senior') || candYears >= 4)) {
    seniorityScore = 100;
  } else if (jobSeniority === 'Staff / Principal' && (candTitle.includes('staff') || candYears >= 7)) {
    seniorityScore = 98;
  } else {
    seniorityScore = 85;
  }

  // Final Weighted Calculation with dynamic or default weights
  const weights = customWeights || DEFAULT_FORMULA_WEIGHTS;
  const totalWeight = 
    (weights.semantic || 0) + 
    (weights.skills || 0) + 
    (weights.tech || 0) + 
    (weights.experience || 0) + 
    (weights.education || 0) + 
    (weights.seniority || 0) || 100;

  const wSem = (weights.semantic || 0) / totalWeight;
  const wSkill = (weights.skills || 0) / totalWeight;
  const wTech = (weights.tech || 0) / totalWeight;
  const wExp = (weights.experience || 0) / totalWeight;
  const wEdu = (weights.education || 0) / totalWeight;
  const wSen = (weights.seniority || 0) / totalWeight;

  const formulaBreakdown: JobMatchBreakdown = {
    semanticSimilarityScore,
    skillOverlapScore,
    experienceScore,
    requiredTechScore,
    educationScore,
    seniorityScore
  };

  const weightedSum =
    semanticSimilarityScore * wSem +
    skillOverlapScore * wSkill +
    requiredTechScore * wTech +
    experienceScore * wExp +
    educationScore * wEdu +
    seniorityScore * wSen;

  const overallMatchScore = Math.round(weightedSum);

  let matchLevel: JobMatchResult['matchLevel'] = 'Moderate Match';
  if (overallMatchScore >= 90) matchLevel = 'Exceptional';
  else if (overallMatchScore >= 80) matchLevel = 'Strong Match';
  else if (overallMatchScore >= 65) matchLevel = 'Moderate Match';
  else if (overallMatchScore >= 50) matchLevel = 'Growth Opportunity';
  else matchLevel = 'Low Fit';

  // Explainable Reasoning Generation
  const whyYouMatched: string[] = [];
  if (matchedSkills.length > 0) {
    whyYouMatched.push(`Strong overlap on core capabilities: ${matchedSkills.slice(0, 4).join(', ')}.`);
  }
  if (expStatus === 'exceeds') {
    whyYouMatched.push(`Your experience (${candYears.toFixed(1)} yrs) comfortably exceeds the minimum required (${reqYears} yrs).`);
  } else if (expStatus === 'meets') {
    whyYouMatched.push(`Your career tenure aligns directly with the target seniority level.`);
  }
  if (bonusSkills.length > 0) {
    whyYouMatched.push(`Demonstrated preferred value-add proficiencies: ${bonusSkills.slice(0, 3).join(', ')}.`);
  }

  const potentialGaps: string[] = [];
  if (missingSkills.length > 0) {
    potentialGaps.push(`Missing prominent job keywords: ${missingSkills.slice(0, 4).join(', ')}.`);
  }
  if (expStatus === 'below') {
    potentialGaps.push(`Position requests ${reqYears}+ years of experience, while your profile reflects ${candYears.toFixed(1)} years.`);
  }

  const keyDifferentiators: string[] = [];
  if (resume.stats.metricsCount >= 5) {
    keyDifferentiators.push('High concentration of quantified business metrics and revenue/latency impacts.');
  }
  if (resume.certifications.length > 0) {
    keyDifferentiators.push(`Verified credentials: ${resume.certifications[0]}.`);
  }
  if (resume.projects.length > 0) {
    keyDifferentiators.push(`Demonstrated hands-on engineering proof via ${resume.projects[0].name}.`);
  }

  const actionableAdvice = missingSkills.length > 0
    ? `Tailor your bullet points to explicitly cite practical usage of ${missingSkills.slice(0, 2).join(' and ')} or highlight analogous frameworks.`
    : `Your resume is exceptionally well-aligned. Focus on preparing technical architecture discussions and system design scenarios.`;

  return {
    job,
    overallMatchScore,
    matchLevel,
    formulaBreakdown,
    matchedSkills,
    missingSkills,
    bonusSkills,
    experienceComparison: {
      candidateYears: candYears,
      requiredYears: reqYears,
      difference: +(candYears - reqYears).toFixed(1),
      status: expStatus
    },
    explainableReasoning: {
      whyYouMatched,
      potentialGaps,
      keyDifferentiators,
      actionableAdvice
    }
  };
}
