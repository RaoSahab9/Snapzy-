import { OpenAIService } from './OpenAIService';
import { ClaudeService } from './ClaudeService';
import { GeminiService } from './GeminiService';
import { config } from '@/config';
import { AIModel, GenerationRequest, GenerationResponse, ProjectFile } from '@/types';

export class AIServiceManager {
  private services: Map<string, any> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Initialize OpenAI service
    if (config.ai.openai.apiKey) {
      this.services.set('openai', new OpenAIService());
    }

    // Initialize Claude service
    if (config.ai.anthropic.apiKey) {
      this.services.set('claude', new ClaudeService());
    }

    // Initialize Gemini service
    if (config.ai.google.apiKey) {
      this.services.set('gemini', new GeminiService());
    }
  }

  async generateCode(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const service = this.services.get(request.aiModel);
      
      if (!service) {
        throw new Error(`AI model '${request.aiModel}' is not available or not configured`);
      }

      // Create enhanced prompt with additional context
      const enhancedPrompt = this.createEnhancedPrompt(request);
      
      // Generate code using the selected AI service
      const response = await service.generateCode(enhancedPrompt);
      
      // Parse the response and extract files and metadata
      const parsedResponse = this.parseAIResponse(response);
      
      return {
        success: true,
        files: parsedResponse.files,
        estimatedTime: parsedResponse.metadata?.estimatedTime || '1-2 hours',
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private createEnhancedPrompt(request: GenerationRequest): string {
    let prompt = request.prompt;

    // Add framework context if specified
    if (request.framework) {
      prompt += `\n\nFramework: ${request.framework}`;
    }

    // Add backend context if specified
    if (request.backend) {
      prompt += `\n\nBackend: ${request.backend}`;
    }

    // Add database context if specified
    if (request.database) {
      prompt += `\n\nDatabase: ${request.database}`;
    }

    // Add features context if specified
    if (request.features && request.features.length > 0) {
      prompt += `\n\nRequired features: ${request.features.join(', ')}`;
    }

    return prompt;
  }

  private parseAIResponse(response: string): { files: ProjectFile[], metadata: any } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      
      if (parsed.files && Array.isArray(parsed.files)) {
        const files: ProjectFile[] = parsed.files.map((file: any) => ({
          path: file.path,
          content: file.content,
          type: 'file',
          size: Buffer.byteLength(file.content, 'utf8'),
        }));

        return {
          files,
          metadata: parsed.metadata || {},
        };
      }
    } catch (error) {
      console.warn('Failed to parse AI response as JSON, treating as raw text');
    }

    // Fallback: treat response as raw code and create a basic structure
    const files: ProjectFile[] = [
      {
        path: 'app.js',
        content: response,
        type: 'file',
        size: Buffer.byteLength(response, 'utf8'),
      },
    ];

    return {
      files,
      metadata: {
        framework: 'unknown',
        backend: 'unknown',
        database: 'unknown',
        features: [],
        estimatedTime: '1-2 hours',
        complexity: 'medium',
      },
    };
  }

  async getAvailableModels(): Promise<AIModel[]> {
    const models: AIModel[] = [];

    // Add OpenAI models
    if (this.services.has('openai')) {
      try {
        const openaiService = this.services.get('openai');
        const openaiModels = await openaiService.getAvailableModels();
        
        openaiModels.forEach((modelId: string) => {
          models.push({
            id: modelId,
            name: modelId,
            provider: 'OpenAI',
            type: 'api',
            isAvailable: true,
            maxTokens: 4000,
            costPerToken: 0.00003,
          });
        });
      } catch (error) {
        console.error('Failed to get OpenAI models:', error);
      }
    }

    // Add Claude models
    if (this.services.has('claude')) {
      try {
        const claudeService = this.services.get('claude');
        const claudeModels = await claudeService.getAvailableModels();
        
        claudeModels.forEach((modelId: string) => {
          models.push({
            id: modelId,
            name: modelId,
            provider: 'Anthropic',
            type: 'api',
            isAvailable: true,
            maxTokens: 4000,
            costPerToken: 0.000015,
          });
        });
      } catch (error) {
        console.error('Failed to get Claude models:', error);
      }
    }

    // Add Gemini models
    if (this.services.has('gemini')) {
      try {
        const geminiService = this.services.get('gemini');
        const geminiModels = await geminiService.getAvailableModels();
        
        geminiModels.forEach((modelId: string) => {
          models.push({
            id: modelId,
            name: modelId,
            provider: 'Google',
            type: 'api',
            isAvailable: true,
            maxTokens: 4000,
            costPerToken: 0.00001,
          });
        });
      } catch (error) {
        console.error('Failed to get Gemini models:', error);
      }
    }

    // Add local models
    models.push({
      id: 'ollama-llama2',
      name: 'Llama 2 (Ollama)',
      provider: 'Ollama',
      type: 'local',
      baseUrl: config.ai.ollama.baseUrl,
      isAvailable: true,
      maxTokens: 4000,
      costPerToken: 0,
    });

    models.push({
      id: 'lmstudio-llama2',
      name: 'Llama 2 (LM Studio)',
      provider: 'LM Studio',
      type: 'local',
      baseUrl: config.ai.lmStudio.baseUrl,
      isAvailable: true,
      maxTokens: 4000,
      costPerToken: 0,
    });

    return models;
  }

  async testModelConnection(modelId: string): Promise<boolean> {
    const service = this.services.get(modelId.split('-')[0]);
    
    if (!service) {
      return false;
    }

    try {
      return await service.testConnection();
    } catch (error) {
      console.error(`Connection test failed for ${modelId}:`, error);
      return false;
    }
  }
}