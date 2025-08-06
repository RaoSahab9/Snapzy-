# OM - AI-Powered Application Generator

Transform your ideas into production-ready applications with the power of AI. OM generates complete full-stack applications including frontend, backend, database, and deployment configuration from simple text descriptions.

## 🚀 Features

- **🧠 Multiple AI Models**: Support for OpenAI GPT-4, Claude, Gemini, Mistral, and local models
- **🔧 Full-Stack Generation**: Complete frontend (React/Vue/Angular), backend (Node.js/Python), and database setup
- **📦 Production Ready**: Industry-standard practices, security, validation, and error handling
- **☁️ Deployment Ready**: Configurations for Vercel, Netlify, Railway, and Docker
- **🎨 Modern UI**: Beautiful React frontend with Tailwind CSS and dark mode
- **⚡ Fast**: Generate complete applications in 2-5 minutes
- **📱 Responsive**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Pluggable AI Engine** (OpenAI, Claude, Gemini, Mistral, Local models)
- **Rate Limiting** and **Security** middleware
- **File Generation** and **ZIP compression**

### Frontend
- **React 18** with functional components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📋 Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **AI API Keys** (at least one):
  - OpenAI API key
  - Anthropic API key
  - Google AI API key
  - Mistral API key
  - Or local models (Ollama, LM Studio)

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd om-ai-app-generator
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Configuration

#### Backend Configuration
Create `.env` file in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your settings:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/om_generator

# AI API Keys (Add your keys here)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here

# Local AI URLs (for Ollama, LM Studio, etc.)
OLLAMA_BASE_URL=http://localhost:11434
LM_STUDIO_BASE_URL=http://localhost:1234

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# File Storage
TEMP_DIR=./temp
MAX_FILE_SIZE=50mb

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

#### Frontend Configuration (Optional)
Create `.env` file in the `frontend` directory if using custom API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Start Backend Only
```bash
npm run backend:dev
```

#### Start Frontend Only
```bash
npm run frontend:dev
```

#### Production Build
```bash
npm run build
npm start
```

## 🚀 Usage

### 1. Open the Application
Navigate to `http://localhost:3000` in your browser.

### 2. Choose an AI Model
Select from available AI models based on your API key configuration.

### 3. Describe Your App
Write a detailed description of the application you want to build. Be specific about:
- Features and functionality
- User roles and authentication
- Data models and relationships
- UI/UX requirements

### 4. Generate Your App
Click "Generate My App" and wait 2-5 minutes for the AI to create your application.

### 5. Download and Use
Once complete, download the ZIP file containing your full-stack application with:
- Complete source code
- Setup instructions
- Dependencies and configuration
- Deployment guides

## 📝 Example Prompts

### Blog Website
```
Create a blog website with user authentication, post creation, editing, commenting system, and admin panel. Include user profiles, categories, search functionality, and responsive design.
```

### E-commerce Store
```
Build an e-commerce website with product catalog, shopping cart, user accounts, payment processing (Stripe), order management, and admin dashboard for inventory management.
```

### Task Management App
```
Develop a task management app with user authentication, project creation, task assignment, due dates, priority levels, team collaboration, and real-time notifications.
```

## 🔧 API Configuration

### OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `OPENAI_API_KEY` in `.env`

### Anthropic Claude Setup
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `ANTHROPIC_API_KEY` in `.env`

### Google Gemini Setup
1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Add to `GOOGLE_API_KEY` in `.env`

### Local Models Setup

#### Ollama
1. Install [Ollama](https://ollama.ai/)
2. Pull a model: `ollama pull llama3`
3. Ensure `OLLAMA_BASE_URL=http://localhost:11434` in `.env`

#### LM Studio
1. Install [LM Studio](https://lmstudio.ai/)
2. Load a model and start the server
3. Set `LM_STUDIO_BASE_URL=http://localhost:1234` in `.env`

## 🏗️ Architecture

### Backend Structure
```
backend/
├── config/          # Database configuration
├── middleware/      # Rate limiting, error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── services/        # AI service and project generator
└── server.js        # Main server file
```

### Frontend Structure
```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── contexts/    # React contexts
│   ├── pages/       # Page components
│   └── services/    # API service
└── package.json
```

### Key API Endpoints
- `POST /api/generate` - Start project generation
- `GET /api/generate/status/:id` - Check generation status
- `GET /api/download/:id` - Download generated project
- `GET /api/models` - List available AI models
- `GET /api/generate/templates` - Get project templates

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build backend
cd backend && docker build -t om-backend .

# Build frontend
cd frontend && docker build -t om-frontend .
```

## 🌐 Production Deployment

### Vercel (Frontend)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway (Backend)
1. Connect your repository to Railway
2. Set environment variables
3. Deploy the backend service

### MongoDB Atlas
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB_URI` in production environment

## 🛠️ Development

### Adding New AI Providers
1. Add provider configuration in `backend/services/aiService.js`
2. Implement the generation method
3. Add to the models list
4. Update environment variables

### Customizing Templates
1. Edit `backend/services/projectGenerator.js`
2. Add new templates to `getProjectTemplates()`
3. Restart the backend

### Frontend Customization
1. Update Tailwind configuration in `frontend/tailwind.config.js`
2. Modify components in `frontend/src/components/`
3. Add new pages in `frontend/src/pages/`

## 🔒 Security Features

- Rate limiting on all endpoints
- Input validation with Joi
- CORS configuration
- Helmet for security headers
- JWT authentication (optional)
- File size limits
- Automatic cleanup of temporary files

## 📊 Monitoring

### Health Checks
- `GET /api/health` - Backend health status
- `GET /api/models/status` - AI model availability

### Logs
- Application logs in console
- Error tracking for failed generations
- Performance metrics for generation time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🆘 Troubleshooting

### Common Issues

#### "Failed to load AI models"
- Check your API keys in `.env`
- Verify network connectivity
- Check API key permissions

#### "Database connection error"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify database permissions

#### "Generation takes too long"
- Check AI model availability
- Verify API rate limits
- Try a different AI model

#### "Download fails"
- Check file permissions in temp directory
- Verify project generation completed
- Check browser download settings

### Getting Help

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Search existing documentation
3. Create a new issue with:
   - Error messages
   - Environment details
   - Steps to reproduce

## 🎯 Roadmap

- [ ] Support for more AI models
- [ ] Custom deployment templates
- [ ] Real-time collaboration
- [ ] Project version control
- [ ] Advanced customization options
- [ ] Plugin system for extensions
- [ ] Cloud-based generation
- [ ] Enterprise features

---

**Made with ❤️ by the OM Team**

Transform your ideas into reality with the power of AI! 🚀