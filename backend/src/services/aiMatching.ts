import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface MatchingCriteria {
  interests?: string[];
  personality?: string[];
  preferredTimes?: string[];
  activity?: string;
  budget?: number;
}

export interface CompanionScore {
  companionId: string;
  score: number;
  reasons: string[];
}

export class AIMatchingService {
  /**
   * Calculate match score between user preferences and companion profile
   */
  calculateMatchScore(userPrefs: MatchingCriteria, companion: any): CompanionScore {
    let score = 0;
    const reasons: string[] = [];
    const maxScore = 100;

    // Price compatibility (20 points)
    if (userPrefs.budget) {
      if (companion.price <= userPrefs.budget) {
        const priceScore = 20 * (1 - (companion.price / userPrefs.budget) * 0.5);
        score += priceScore;
        reasons.push('Within your budget');
      }
    } else {
      score += 15;
    }

    // Interests overlap (30 points)
    if (userPrefs.interests && companion.matchingProfile?.interests) {
      const commonInterests = userPrefs.interests.filter(i =>
        companion.matchingProfile.interests.some((ci: string) =>
          ci.toLowerCase().includes(i.toLowerCase())
        )
      );
      const interestScore = (commonInterests.length / userPrefs.interests.length) * 30;
      score += interestScore;
      if (commonInterests.length > 0) {
        reasons.push(`Shared interests: ${commonInterests.join(', ')}`);
      }
    } else {
      score += 15;
    }

    // Personality match (25 points)
    if (userPrefs.personality && companion.matchingProfile?.personality) {
      const commonTraits = userPrefs.personality.filter(p =>
        companion.matchingProfile.personality.includes(p)
      );
      const personalityScore = (commonTraits.length / userPrefs.personality.length) * 25;
      score += personalityScore;
      if (commonTraits.length > 0) {
        reasons.push(`Matching personality: ${commonTraits.join(', ')}`);
      }
    } else {
      score += 12;
    }

    // Time availability (15 points)
    if (userPrefs.preferredTimes && companion.matchingProfile?.preferredTimes) {
      const commonTimes = userPrefs.preferredTimes.filter(t =>
        companion.matchingProfile.preferredTimes.includes(t)
      );
      const timeScore = (commonTimes.length / userPrefs.preferredTimes.length) * 15;
      score += timeScore;
      if (commonTimes.length > 0) {
        reasons.push('Available at your preferred times');
      }
    } else {
      score += 7;
    }

    // Rating bonus (10 points)
    const ratingBonus = (companion.rating / 5) * 10;
    score += ratingBonus;
    if (companion.rating >= 4.5) {
      reasons.push('Highly rated by others');
    }

    return {
      companionId: companion.id,
      score: Math.min(Math.round(score), maxScore),
      reasons,
    };
  }

  /**
   * Get AI-powered companion recommendations
   */
  async getRecommendations(
    companions: any[],
    userPrefs: MatchingCriteria
  ): Promise<CompanionScore[]> {
    const scores = companions.map(companion =>
      this.calculateMatchScore(userPrefs, companion)
    );

    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate AI chat response
   */
  async generateChatResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    companions?: any[]
  ): Promise<string> {
    try {
      const systemPrompt = `You are a friendly AI assistant helping users find the perfect companion for various activities. 
Your role is to:
1. Understand what the user is looking for (activity, personality type, schedule)
2. Ask clarifying questions if needed
3. Recommend suitable companions based on their preferences
4. Be warm, conversational, and helpful

Keep responses concise and friendly. ${companions ? `Here are available companions: ${JSON.stringify(companions.map(c => ({ name: c.name, title: c.title, activities: c.activities })))}` : ''}`;

      const chat = model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        systemInstruction: systemPrompt,
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;

      return response.text() || 'I\'m here to help you find the perfect companion!';
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I\'m having trouble processing that right now. Could you try rephrasing?';
    }
  }

  /**
   * Extract user preferences from natural language
   */
  async extractPreferences(userMessage: string): Promise<MatchingCriteria> {
    try {
      const prompt = `Extract the following information from this user request: "${userMessage}"

Return ONLY a valid JSON object with these fields (only include if explicitly mentioned):
- interests: array of interests/hobbies
- personality: array of personality traits (e.g., "relaxed", "energetic", "thoughtful")
- preferredTimes: array of time preferences (e.g., "morning", "afternoon", "evening", "weekend")
- activity: specific activity mentioned
- budget: budget amount if mentioned

Example: {"interests": ["golf"], "personality": ["relaxed"], "preferredTimes": ["weekend"]}`;

      const result = await model.generateContent(prompt);
      const content = result.response.text().trim();
      // Strip markdown code fence if present
      const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error extracting preferences:', error);
      return {};
    }
  }
}

export const aiMatchingService = new AIMatchingService();
