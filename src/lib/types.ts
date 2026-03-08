export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  category: string;
  skills: string[];
  description: string;
  hourlyRate: number;
  availability: 'immediate' | 'within-week' | 'within-month';
  rating: number;
  completedProjects: number;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  clientName: string;
  email: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: 'urgent' | 'within-week' | 'within-month' | 'flexible';
  requiredSkills: string[];
  createdAt: string;
}

export interface MatchResult {
  provider: ServiceProvider;
  score: number; // 0-100
  reasons: string[];
  categoryMatch: boolean;
  budgetCompatible: boolean;
  availabilityMatch: boolean;
  keywordScore: number;
}
