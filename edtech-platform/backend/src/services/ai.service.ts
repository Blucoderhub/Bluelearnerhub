import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateQuiz(domain: string, level: number, performance: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert ${domain} tutor on the BLUELEARNERHUB platform.
      Generate 5 challenging quiz questions for a student at Level ${level}.
      User performance context: ${performance}.
      
      Question formats: MCQ, Numerical, Case-based, Coding (if applicable), Design.
      
      Return the response in JSON format:
      {
        "questions": [
          {
            "type": "string",
            "content": "string",
            "options": ["string"],
            "correctAnswer": "string",
            "explanation": "string"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Find the JSON block in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return null;
    }
  }

  async chatAssistantStream(query: string, context: any, persona: 'tutor' | 'technical' | 'manager' | 'career' | 'competition' = 'tutor') {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const systemPrompts = {
      tutor: "You are the BLUELEARNERHUB AI Tutor. Your goal is to simplify complex concepts, be encouraging, and guide students through their learning path with Socratic questioning.",
      technical: "You are the BLUELEARNERHUB Engineering Lead. Provide high-performance code, architecture critiques, and deeply technical solutions for software, mechanical, or electrical challenges.",
      manager: "You are the BLUELEARNERHUB Management Consultant. Focus on ROI, strategic positioning, project management (Agile/Scrum), and business analytics.",
      career: "You are the BLUELEARNERHUB Career Accelerator. Help with resume optimization, portfolio building, interview preparation, and industry networking strategies.",
      competition: "You are the BLUELEARNERHUB Hackathon Strategist. Focus on rapid prototyping, 'winning' features, presentation deck polish, and technical efficiency."
    };

    const prompt = `
            ${systemPrompts[persona]}
            
            USER_CONTEXT:
            - Name: ${context.userName || 'Learner'}
            - Domain: ${context.domain || 'General Engineering/Management'}
            - Level: ${context.level || 1}
            - Page Context: ${context.path || 'Dashboard'}
            
            Current Query: ${query}
            
            Respond in Markdown. Be concise but impactful. If suggesting code or designs, ensure they are state-of-the-art.
        `;

    const result = await model.generateContentStream(prompt);
    return result.stream;
  }

  async chatAssistant(query: string, context: any) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      User: ${query}
      Context: ${JSON.stringify(context)}
      Role: You are the BLUELEARNERHUB AI Assistant. Provide professional, encouraging, and highly technical or strategic advice based on the user's domain.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

export const aiService = new AIService();
