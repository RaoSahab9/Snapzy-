const axios = require('axios');

class AIService {
  constructor() {
    this.providers = {
      'openai-gpt4': this.generateWithOpenAI.bind(this),
      'openai-gpt4o': this.generateWithOpenAI.bind(this),
      'claude-3-sonnet': this.generateWithClaude.bind(this),
      'claude-3-haiku': this.generateWithClaude.bind(this),
      'gemini-pro': this.generateWithGemini.bind(this),
      'llama3': this.generateWithLlama.bind(this),
      'mistral': this.generateWithMistral.bind(this),
      'ollama': this.generateWithOllama.bind(this),
      'lm-studio': this.generateWithLMStudio.bind(this)
    };
  }

  async generateProject(prompt, aiModel) {
    const provider = this.providers[aiModel];
    if (!provider) {
      throw new Error(`Unsupported AI model: ${aiModel}`);
    }

    const enhancedPrompt = this.createProjectGenerationPrompt(prompt);
    return await provider(enhancedPrompt, aiModel);
  }

  createProjectGenerationPrompt(userPrompt) {
    return `You are an expert full-stack developer. Generate a complete, production-ready application based on this description: "${userPrompt}"

REQUIREMENTS:
1. Provide the complete file structure as JSON
2. Include all necessary files with full content
3. Create frontend, backend, database schema, and setup instructions
4. Use modern, industry-standard practices
5. Include proper error handling, validation, and security
6. Add deployment configuration

RESPONSE FORMAT (JSON only):
{
  "projectName": "project-name",
  "description": "Brief description",
  "techStack": {
    "frontend": "react/vue/angular",
    "backend": "nodejs/python/php",
    "database": "mongodb/postgresql/mysql",
    "deployment": "vercel/netlify/docker"
  },
  "files": {
    "frontend/src/App.js": "// Complete React App component\\ncode here...",
    "backend/server.js": "// Complete Express server\\ncode here...",
    "database/models/User.js": "// Database models\\ncode here...",
    "README.md": "# Project Setup\\nInstructions here...",
    "package.json": "{ \\"dependencies\\": {...} }",
    // ... all other files
  }
}

Generate COMPLETE, WORKING code. No placeholders or comments like "// Add more logic here".`;
  }

  async generateWithOpenAI(prompt, model) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model === 'openai-gpt4o' ? 'gpt-4o' : 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior full-stack developer who creates complete, production-ready applications.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateWithClaude(prompt, model) {
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: model === 'claude-3-haiku' ? 'claude-3-haiku-20240307' : 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      return this.parseAIResponse(response.data.content[0].text);
    } catch (error) {
      throw new Error(`Claude API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateWithGemini(prompt) {
    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      });

      return this.parseAIResponse(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateWithMistral(prompt) {
    try {
      const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      throw new Error(`Mistral API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateWithLlama(prompt) {
    // This would connect to a hosted Llama API or local instance
    try {
      // Example for Replicate or other Llama hosting service
      const response = await axios.post('https://api.replicate.com/v1/predictions', {
        version: "meta/llama-2-70b-chat",
        input: {
          prompt: prompt,
          max_length: 4000
        }
      }, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseAIResponse(response.data.output);
    } catch (error) {
      throw new Error(`Llama API error: ${error.message}`);
    }
  }

  async generateWithOllama(prompt) {
    try {
      const response = await axios.post(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
        model: 'llama3',
        prompt: prompt,
        stream: false
      });

      return this.parseAIResponse(response.data.response);
    } catch (error) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  async generateWithLMStudio(prompt) {
    try {
      const response = await axios.post(`${process.env.LM_STUDIO_BASE_URL}/v1/chat/completions`, {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      throw new Error(`LM Studio API error: ${error.message}`);
    }
  }

  parseAIResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, create a basic structure
      throw new Error('No valid JSON structure found in AI response');
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  getAvailableModels() {
    return [
      {
        id: 'openai-gpt4',
        name: 'GPT-4',
        provider: 'OpenAI',
        description: 'Most capable OpenAI model',
        requiresKey: 'OPENAI_API_KEY'
      },
      {
        id: 'openai-gpt4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        description: 'Optimized GPT-4 model',
        requiresKey: 'OPENAI_API_KEY'
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        description: 'Balanced performance and speed',
        requiresKey: 'ANTHROPIC_API_KEY'
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        description: 'Fast and efficient',
        requiresKey: 'ANTHROPIC_API_KEY'
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Google\'s advanced AI model',
        requiresKey: 'GOOGLE_API_KEY'
      },
      {
        id: 'mistral',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        description: 'European AI excellence',
        requiresKey: 'MISTRAL_API_KEY'
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        provider: 'Local',
        description: 'Run models locally with Ollama',
        requiresKey: null
      },
      {
        id: 'lm-studio',
        name: 'LM Studio (Local)',
        provider: 'Local',
        description: 'Run models locally with LM Studio',
        requiresKey: null
      }
    ];
  }
}

module.exports = new AIService();