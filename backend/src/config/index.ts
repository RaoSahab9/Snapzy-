import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  server: {
    port: number;
    nodeEnv: string;
    corsOrigin: string;
  };
  mongodb: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  upload: {
    path: string;
    maxFileSize: number;
  };
  ai: {
    openai: {
      apiKey: string;
    };
    anthropic: {
      apiKey: string;
    };
    google: {
      apiKey: string;
    };
    mistral: {
      apiKey: string;
    };
    llama: {
      apiKey: string;
    };
    ollama: {
      baseUrl: string;
    };
    lmStudio: {
      baseUrl: string;
    };
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/om',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY || '',
    },
    mistral: {
      apiKey: process.env.MISTRAL_API_KEY || '',
    },
    llama: {
      apiKey: process.env.LLAMA_API_KEY || '',
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    },
    lmStudio: {
      baseUrl: process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234',
    },
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export { config };