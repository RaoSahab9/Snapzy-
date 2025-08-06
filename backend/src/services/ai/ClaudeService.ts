import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/config';
import { ClaudeMessage } from '@/types';

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.anthropic.apiKey,
    });
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

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        system: systemMessage,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0]?.text;
      
      if (!content) {
        throw new Error('No response content from Claude');
      }

      return content;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Claude API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 5,
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
      });
      
      return !!response.content[0]?.text;
    } catch (error) {
      console.error('Claude connection test failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.data
        .filter(model => model.id.includes('claude'))
        .map(model => model.id);
    } catch (error) {
      console.error('Failed to fetch Claude models:', error);
      return ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];
    }
  }
}