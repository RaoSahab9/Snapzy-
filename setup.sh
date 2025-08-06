#!/bin/bash

echo "🚀 Setting up OM - AI-Powered App Generator"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB 6+ or use MongoDB Atlas."
    echo "   You can install MongoDB from: https://docs.mongodb.com/manual/installation/"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for backend..."
    cp .env.example .env
    echo "✅ Backend .env file created. Please edit it with your configuration."
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for frontend..."
    cp .env.example .env
    echo "✅ Frontend .env file created."
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your AI model API keys in backend/.env"
echo "2. Start MongoDB (if using local installation)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "🔧 Configuration files to edit:"
echo "   - backend/.env (API keys, database URL, etc.)"
echo "   - frontend/.env (API URL)"
echo ""
echo "📚 Documentation: README.md"