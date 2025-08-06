import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/config';
import { GeminiMessage } from '@/types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.ai.google.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateCode(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const systemMessage = systemPrompt || `You are an expert full-stack developer. Generate complete, production-ready code for the requested application. 
      
      Requirements:
      - Generate complete frontend, backend, and database code
      - Include all necessary configuration files (package.json, .env.example, etc.)
      - Provide clear setup instructions in README.md
      - Use modern best practices and security standards
      - Include proper error handling and validation
      - Structure the response as a JSON object with file paths and content
      
      Response format:
      {
        "files": [
          {
            "path": "frontend/src/App.js",
            "content": "// React component code here"
          },
          {
            "path": "backend/server.js", 
            "content": "// Node.js server code here"
          }
        ],
        "metadata": {
          "framework": "react",
          "backend": "nodejs",
          "database": "mongodb",
          "features": ["authentication", "api"],
          "estimatedTime": "2-3 hours",
          "complexity": "medium"
        }
      }`;

      const fullPrompt = `${systemMessage}\n\nUser request: ${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('No response content from Gemini');
      }

      return content;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.genAI.listModels();
      return models.models
        .filter((model: any) => model.name.includes('gemini'))
        .map((model: any) => model.name);
    } catch (error) {
      console.error('Failed to fetch Gemini models:', error);
      return ['gemini-pro', 'gemini-pro-vision'];
    }
  }
}