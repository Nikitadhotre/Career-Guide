# 🎓 Career Guidance System

A comprehensive web application that helps students discover their career path through aptitude testing, personalized recommendations, and college guidance.

![Career Guidance System](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-purple)

## 🌟 Live Demo

**🌐 Production URL**: [https://career-guidance-1bro.vercel.app](https://career-guidance-1bro.vercel.app)

## ✨ Features

### 🎯 For Students
- **Aptitude Testing**: 20-question career aptitude assessment with 30-minute time limit
- **Personalized Results**: Detailed analysis of strengths and interests based on test responses
- **Career Recommendations**: Career suggestions based on aptitude test results and interest tags
- **College Database**: Extensive database of colleges and universities with filtering options
- **College Search & Filter**: Search colleges by location, stream, rating, and other criteria
- **Save Colleges**: Bookmark and manage your preferred colleges
- **Test History**: Track your test history and view previous results
- **User Dashboard**: Personalized dashboard with statistics and saved colleges
- **Progress Tracking**: Monitor your career exploration journey

### 👨‍💼 For Administrators
- **Admin Dashboard**: Overview of system statistics and user activity
- **User Management**: View, manage, and control user access
- **Test Analytics**: View test results and performance metrics
- **Question Management**: Add, edit, and manage aptitude test questions
- **College Management**: Maintain and update college database
- **System Monitoring**: Monitor system health and user activity

### 🎨 User Experience
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Updates**: Live data updates and notifications
- **Progressive Web App**: Install as a native app on your device

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Beautiful notifications
- **Chart.js** - Data visualization and analytics
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Deployment
- **Vercel** - Unified frontend and backend deployment
- **MongoDB Atlas** - Cloud database service
- **GitHub** - Version control and CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Code-Game-Ninja/Career-Guidance.git
   cd Career-Guidance
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   VITE_API_URL=http://localhost:5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run start
   
   # Or start them separately
   npm run dev          # Frontend only
   npm run server       # Backend only
   ```

5. **Open your browser**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
career-guidance/
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── config/            # Configuration files
│   └── App.jsx            # Main App component
├── server/                # Backend Node.js code
│   ├── routes/            # API route handlers
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── public/                # Static assets
│   ├── images/            # SVG illustrations
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO configuration
├── vercel.json            # Vercel deployment config
├── package.json           # Frontend dependencies
└── README.md              # Project documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Aptitude Testing
- `GET /api/aptitude/questions` - Get test questions (20 questions)
- `POST /api/aptitude/submit` - Submit test results
- `GET /api/aptitude/history` - Get user's test history

### User Management
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/saved-colleges` - Get saved colleges
- `POST /api/user/save-college` - Save a college
- `DELETE /api/user/remove-college` - Remove saved college

### Colleges
- `GET /api/colleges` - Get colleges with filters
- `GET /api/colleges/filters` - Get available filters

### Admin (Protected)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Toggle user status
- `GET /api/admin/questions` - Get all questions
- `GET /api/admin/colleges` - Get all colleges
- `GET /api/admin/test-results` - Get test analytics

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is configured for unified deployment on Vercel with both frontend and backend on the same domain.

1. **Connect to GitHub**
   - Push your code to GitHub
   - Import repository in Vercel dashboard

2. **Set Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Both frontend and backend will be available on the same domain

### Manual Deployment

For manual deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Frontend API base URL | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Backend server port | No (default: 5000) |

### Build Configuration

The project uses Vite for frontend building and includes:
- **Code splitting** for optimal performance
- **Tree shaking** to reduce bundle size
- **Hot module replacement** for development
- **PWA support** with service worker

## 🧪 Testing

### Frontend Testing
```bash
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

### Backend Testing
```bash
cd server
npm test              # Run backend tests
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: < 2 seconds on 3G
- **PWA Ready**: Installable as native app

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Server-side validation
- **Helmet.js** - Security headers
- **Environment Variables** - Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chirag Mishra**
- GitHub: [@Code-Game-Ninja](https://github.com/Code-Game-Ninja)
- Project: Career Guidance System

## 🙏 Acknowledgments

- **Vercel** for hosting and deployment
- **MongoDB Atlas** for database services
- **Tailwind CSS** for the beautiful UI framework
- **React Community** for the amazing ecosystem

## 📞 Support

If you have any questions or need support:
- Create an issue on GitHub
- Check the documentation in the project
- Review the deployment guides

---

**⭐ Star this repository if you found it helpful!**

**🚀 Ready to discover your perfect career path? Visit the live application!**
