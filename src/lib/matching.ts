import { ServiceProvider, ServiceRequest, MatchResult } from './types';

// Common English stopwords to filter out
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'need', 'dare', 'ought', 'used', 'not', 'no', 'nor', 'so', 'yet',
  'both', 'either', 'neither', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'than', 'too', 'very', 'just', 'this', 'that', 'these',
  'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
  'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
  'all', 'any', 'am', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'up', 'about', 'also', 'if', 'while',
]);

/**
 * Tokenize a string: lowercase, remove non-alpha chars, filter stopwords.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Build a term-frequency map from a list of tokens.
 */
function buildTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }
  return tf;
}

/**
 * Compute cosine-like overlap score between two token sets using TF weighting.
 * Returns a normalized score between 0 and 1.
 */
function tfidfOverlap(textA: string[], textB: string[]): number {
  if (textA.length === 0 || textB.length === 0) return 0;

  const tfA = buildTF(textA);
  const tfB = buildTF(textB);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const [term, freqA] of tfA) {
    magA += freqA * freqA;
    const freqB = tfB.get(term) ?? 0;
    dotProduct += freqA * freqB;
  }
  for (const [, freqB] of tfB) {
    magB += freqB * freqB;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Check if provider's hourly rate is compatible with the request budget.
 * Assumes an average engagement of ~20 hours.
 */
function isBudgetCompatible(provider: ServiceProvider, request: ServiceRequest): boolean {
  const estimatedCost = provider.hourlyRate * 20;
  return estimatedCost <= request.budget * 1.2; // allow 20% overage
}

/**
 * Check if the provider's availability aligns with the request timeline.
 */
function isAvailabilityMatch(
  availability: ServiceProvider['availability'],
  timeline: ServiceRequest['timeline']
): boolean {
  const urgencyMap: Record<string, number> = {
    immediate: 0,
    'within-week': 1,
    'within-month': 2,
    flexible: 3,
  };
  const providerUrgency = urgencyMap[availability];
  const requestUrgency = urgencyMap[timeline] ?? 3;
  // Provider can meet the deadline if they are at least as available as needed
  return providerUrgency <= requestUrgency;
}

/**
 * Compute how many of the request's required skills the provider has (0-1).
 */
function skillCoverage(provider: ServiceProvider, request: ServiceRequest): number {
  if (request.requiredSkills.length === 0) return 1;
  const providerSkillsLower = provider.skills.map((s) => s.toLowerCase());
  const matched = request.requiredSkills.filter((skill) =>
    providerSkillsLower.some(
      (ps) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps)
    )
  );
  return matched.length / request.requiredSkills.length;
}

/**
 * Main AI matching function.
 * Scores each provider against the request using a weighted formula and
 * returns a ranked list of MatchResult objects.
 */
export function matchProviders(
  request: ServiceRequest,
  providers: ServiceProvider[]
): MatchResult[] {
  // Build the query corpus from the request
  const requestTokens = tokenize(
    `${request.title} ${request.description} ${request.requiredSkills.join(' ')}`
  );

  const results: MatchResult[] = providers.map((provider) => {
    const providerTokens = tokenize(
      `${provider.description} ${provider.skills.join(' ')}`
    );

    // --- Individual scoring components ---

    // 1. TF-IDF keyword overlap (0-1)
    const rawKeyword = tfidfOverlap(requestTokens, providerTokens);
    const keywordScore = Math.min(rawKeyword * 3.5, 1); // amplify sparse matches

    // 2. Skill coverage (0-1)
    const skillScore = skillCoverage(provider, request);

    // 3. Category match (0 or 1)
    const categoryMatch =
      provider.category.toLowerCase() === request.category.toLowerCase();

    // 4. Budget compatibility
    const budgetCompatible = isBudgetCompatible(provider, request);

    // 5. Availability match
    const availabilityMatch = isAvailabilityMatch(provider.availability, request.timeline);

    // 6. Provider quality (normalized rating 0-1)
    const qualityScore = (provider.rating - 1) / 4; // rating is 1-5

    // --- Weighted formula ---
    // Keywords + skills are the strongest signals; category, budget, availability are modifiers
    const rawScore =
      keywordScore * 35 +
      skillScore * 30 +
      (categoryMatch ? 20 : 0) +
      (budgetCompatible ? 8 : 0) +
      (availabilityMatch ? 4 : 0) +
      qualityScore * 3;

    const score = Math.round(Math.min(rawScore, 100));

    // --- Build human-readable reasons ---
    const reasons: string[] = [];

    if (categoryMatch) {
      reasons.push(`Exact category match: ${provider.category}`);
    }

    if (skillScore >= 0.75) {
      reasons.push(`Covers ${Math.round(skillScore * 100)}% of required skills`);
    } else if (skillScore >= 0.4) {
      reasons.push(`Covers ${Math.round(skillScore * 100)}% of required skills`);
    }

    if (keywordScore >= 0.5) {
      reasons.push('Strong keyword overlap with request description');
    } else if (keywordScore >= 0.2) {
      reasons.push('Good keyword match with request description');
    }

    if (budgetCompatible) {
      reasons.push(`Hourly rate ($${provider.hourlyRate}/hr) is within budget`);
    } else {
      reasons.push(`Hourly rate ($${provider.hourlyRate}/hr) may exceed budget`);
    }

    if (availabilityMatch) {
      reasons.push(`Available: ${provider.availability.replace(/-/g, ' ')}`);
    } else {
      reasons.push(`Availability (${provider.availability.replace(/-/g, ' ')}) may not meet timeline`);
    }

    if (provider.rating >= 4.8) {
      reasons.push(`Top-rated provider (${provider.rating}★)`);
    } else if (provider.rating >= 4.5) {
      reasons.push(`Highly rated provider (${provider.rating}★)`);
    }

    return {
      provider,
      score,
      reasons,
      categoryMatch,
      budgetCompatible,
      availabilityMatch,
      keywordScore: Math.round(keywordScore * 100),
    };
  });

  // Sort by score descending, break ties by rating
  return results.sort((a, b) => b.score - a.score || b.provider.rating - a.provider.rating);
}
