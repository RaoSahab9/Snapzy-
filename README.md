# Snapzy - Instagram-like Social Media App

A full-stack social media platform built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Image Upload**: Post images with captions using Cloudinary
- **Social Features**: Like, comment, follow/unfollow users
- **User Profiles**: View and edit profile information
- **Real-time Feed**: See posts from followed users
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router
- Axios
- React Context (State Management)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- Multer (File Upload)

## 📁 Project Structure

```
snapzy/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Installation

#### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd snapzy

# Run the setup script
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snapzy
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/snapzy
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Optional: For production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Start backend server (from server directory)
   cd server
   npm run dev
   
   # Start frontend (from client directory) - in a new terminal
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables Setup

#### MongoDB
- **Local**: Use `mongodb://localhost:27017/snapzy`
- **Cloud**: Use MongoDB Atlas connection string

#### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard → Settings → Access Keys
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

#### JWT Secret
Generate a secure random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📱 Features Overview

### Authentication
- User registration with email and password
- JWT-based login system
- Protected routes

### Posts
- Upload images with captions
- Like and unlike posts
- Add comments
- View post details

### User Profiles
- View user profiles with posts
- Follow/unfollow users
- Edit profile information
- Upload profile pictures

### Feed
- View posts from followed users
- Real-time updates
- Infinite scroll (optional)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variable: `REACT_APP_API_URL` pointing to your backend URL
5. Deploy

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` (your frontend URL)
5. Deploy

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@snapzy.com or create an issue in the repository.