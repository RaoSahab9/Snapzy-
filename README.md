# 🧘 OM - AI-Powered App Generator

**OM** is a full-stack AI-powered application that generates complete source code from plain English descriptions. Describe any app or website, and OM will create a production-ready codebase with frontend, backend, database, and setup instructions.

## 🚀 Features

- **AI-Powered Generation**: Describe your app in plain English
- **Multi-Model Support**: OpenAI, Claude, Gemini, Llama, Mistral, and local models
- **Complete Stack**: Frontend, backend, database, and deployment configs
- **Multiple Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt.js
- **Backend Options**: Node.js, Python, Go, Rust, Java, C#
- **Database Support**: MongoDB, PostgreSQL, MySQL, SQLite
- **Deployment Ready**: Vercel, Render, Railway, Docker configs
- **File Management**: Download generated projects as ZIP files

## 🏗️ Architecture

```
OM/
├── frontend/          # React + Tailwind CSS UI
├── backend/           # Node.js + Express API
├── ai-engine/         # Pluggable AI model handlers
├── database/          # MongoDB schemas and models
├── templates/         # Code generation templates
└── docs/             # Documentation and guides
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Query** for state management
- **Monaco Editor** for code preview

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Archiver** for ZIP creation

### AI Engine
- **OpenAI API** (GPT-4, GPT-4o)
- **Anthropic Claude API**
- **Google Gemini API**
- **Meta Llama 3** (via API)
- **Mistral AI API**
- **Local models** (Ollama, LM Studio)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd om
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Start the application**
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/om

# JWT
JWT_SECRET=your-jwt-secret

# AI Models
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key
MISTRAL_API_KEY=your-mistral-key

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=1.0.0
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Projects
- `POST /api/projects/generate` - Generate new project
- `GET /api/projects` - List user projects
- `GET /api/projects/:id` - Get project details
- `GET /api/projects/:id/download` - Download project ZIP

### AI Models
- `GET /api/models` - List available AI models
- `POST /api/models/test` - Test model connection

## 🎯 Example Prompts

### Blog Application
```
"Create a blog application with user authentication, post creation, commenting system, and admin dashboard. Use React for frontend, Node.js for backend, and MongoDB for database."
```

### E-commerce Platform
```
"Build an e-commerce platform with product catalog, shopping cart, user authentication, payment integration, and order management. Use Next.js, Express, and PostgreSQL."
```

### Task Management App
```
"Develop a task management application with user registration, project creation, task assignment, progress tracking, and real-time notifications. Use Vue.js, FastAPI, and SQLite."
```

### Social Media Platform
```
"Create a social media platform with user profiles, posts, likes, comments, follow system, and real-time messaging. Use React, Django, and PostgreSQL."
```

## 🔌 AI Model Integration

OM supports multiple AI models through a pluggable architecture:

### OpenAI
```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

### Anthropic Claude
```javascript
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

### Google Gemini
```javascript
const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});
```

### Local Models (Ollama)
```javascript
const ollama = new Ollama({
  baseUrl: 'http://localhost:11434'
});
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Deploy to Render or Railway
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue for bugs or feature requests
- Join our Discord community
- Check the documentation in `/docs`

---

**OM** - Transform your ideas into reality with AI-powered code generation! 🧘✨