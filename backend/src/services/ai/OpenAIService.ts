import OpenAI from 'openai';
import { config } from '@/config';
import { OpenAIMessage } from '@/types';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.ai.openai.apiKey,
    });
  }

  async generateCode(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: OpenAIMessage[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'system',
        content: `You are an expert full-stack developer. Generate complete, production-ready code for the requested application. 
        
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
        }`,
      });

      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });
      
      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => model.id);
    } catch (error) {
      console.error('Failed to fetch OpenAI models:', error);
      return ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo'];
    }
  }
}