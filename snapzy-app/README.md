# Snapzy - Instagram-like Social Media App

A complete full-stack social media platform built with React, Node.js, Express, and MongoDB.

![Snapzy Logo](https://via.placeholder.com/200x100/405DE6/FFFFFF?text=Snapzy)

## ✨ Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 📸 **Image Upload & Posting** - Upload and share photos with captions
- 💝 **Like & Comment System** - Interact with posts through likes and comments
- 👥 **Follow/Unfollow Users** - Build your social network
- 🏠 **Personal Feed** - See posts from users you follow
- 👤 **User Profiles** - Customizable user profiles with bio and stats
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful, Instagram-inspired interface

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Context** - State management for global app state
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing for security
- **Cloudinary** - Cloud-based image and video management
- **Multer** - Middleware for handling multipart/form-data

## 🛠️ Quick Start

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/downloads)

### 🔧 Installation

1. **Clone the repository:**
```bash
git clone <your-repository-url>
cd snapzy-app
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

### 📁 Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/snapzy
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/snapzy

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables

The frontend `.env` file is already configured, but you can modify it if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Snapzy
```

### 🔑 Cloudinary Setup (Optional but Recommended)

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these values to your backend `.env` file

> **Note:** Without Cloudinary, image uploads will fail. You can modify the code to use local file storage if preferred.

### 🚀 Running the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Option 2: Quick Start Script (Coming Soon)

```bash
npm run dev  # Will start both backend and frontend
```

### 📱 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| POST | `/api/users/:id/follow` | Follow/Unfollow user |
| GET | `/api/users/:id/followers` | Get user followers |
| GET | `/api/users/:id/following` | Get user following |
| GET | `/api/users/search?q=query` | Search users |

### Post Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/feed` | Get user's feed |
| GET | `/api/posts/explore` | Get trending posts |
| GET | `/api/posts/:id` | Get single post |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/posts/user/:userId` | Get user's posts |

### Interaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:id/like` | Toggle like on post |
| POST | `/api/posts/:id/comments` | Add comment to post |
| DELETE | `/api/posts/:postId/comments/:commentId` | Delete comment |

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  profilePicture: String (URL),
  bio: String (max 150 chars),
  followers: [ObjectId],
  following: [ObjectId],
  isPrivate: Boolean (default: false),
  timestamps: true
}
```

### Post Model
```javascript
{
  user: ObjectId (ref: User, required),
  image: String (URL, required),
  caption: String (max 500 chars),
  location: String,
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId (ref: User),
    text: String (max 300 chars),
    createdAt: Date
  }],
  hashtags: [String],
  timestamps: true
}
```

### Follow Model
```javascript
{
  follower: ObjectId (ref: User, required),
  following: ObjectId (ref: User, required),
  status: String (enum: ['pending', 'accepted'], default: 'accepted'),
  timestamps: true
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment:**
```bash
cd backend
npm run build  # If you have a build script
```

2. **Environment Variables:**
Set all the environment variables in your deployment platform:
- `MONGODB_URI` (use MongoDB Atlas for production)
- `JWT_SECRET`
- `CLOUDINARY_*` variables
- `FRONTEND_URL` (your deployed frontend URL)

3. **Deploy:**
- **Render**: Connect your GitHub repo and deploy
- **Railway**: `railway login && railway deploy`
- **Heroku**: `heroku create app-name && git push heroku main`

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy:**
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `build` folder or connect via Git

3. **Environment Variables:**
Update `REACT_APP_API_URL` to point to your deployed backend.

### Database Setup (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to the whitelist
4. Create a database user
5. Get your connection string and update `MONGODB_URI`

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📂 Project Structure

```
snapzy-app/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── postController.js
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Follow.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── posts.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── utils/               # Utility functions
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── jwt.js
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Main server file
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   └── CommentBox.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Feed.tsx
│   │   │   ├── Upload.tsx
│   │   │   └── Profile.tsx
│   │   ├── context/         # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── PostContext.tsx
│   │   ├── utils/           # Utility functions
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex functionality
- Ensure responsive design for all components
- Test your changes before submitting

## 📝 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Make sure MongoDB is running locally or check your Atlas connection string
   - Verify your IP is whitelisted in MongoDB Atlas

2. **CORS Errors:**
   - Ensure `FRONTEND_URL` is set correctly in backend `.env`
   - Check that frontend is running on the expected port

3. **Image Upload Fails:**
   - Verify Cloudinary credentials in `.env`
   - Check file size (max 10MB)
   - Ensure file type is supported (JPG, PNG, GIF, WebP)

4. **JWT Token Errors:**
   - Make sure `JWT_SECRET` is set and consistent
   - Check token expiration (default: 7 days)

5. **Build Errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility

### Getting Help

- Create an issue on GitHub
- Check the existing issues for solutions
- Join our community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Instagram's design and functionality
- Built with modern web technologies
- Thanks to the open-source community for amazing tools and libraries

## 🔮 Future Features

- [ ] Real-time notifications
- [ ] Stories feature
- [ ] Direct messaging
- [ ] Video posts
- [ ] Advanced search and filters
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Multiple image posts

---

Made with ❤️ by the Snapzy Team