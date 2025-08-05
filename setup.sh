#!/bin/bash

echo "🚀 Setting up Snapzy Social Media App..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

cd ..

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cp server/.env.example server/.env
    echo "✅ .env file created"
    echo "⚠️  Please update server/.env with your configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your configuration:"
echo "   - MongoDB connection string"
echo "   - JWT secret"
echo "   - Cloudinary credentials"
echo ""
echo "2. Start MongoDB (if running locally)"
echo ""
echo "3. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "4. Start the frontend development server:"
echo "   cd client && npm start"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"