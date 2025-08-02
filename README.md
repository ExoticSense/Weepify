# Weepify - Crying Tracker App 😭💧

## Basic Details
### Team Name: Emotional Engineers

### Team Members
- Member 1: Manna Maria John - Model Engineering College
- Member 2: Jeevan Jose - Model Engineering College

### Project Description
Weepify is the world's first professional crying tracker that quantifies your emotional releases, calculates how many plants you could water with your tears, and gamifies the therapeutic process of crying.

### The Problem (that doesn't exist)
People cry every day but have absolutely no idea about their crying statistics! How much have you cried this week? How many plants could you have watered? What's your longest crying streak? This crucial data was completely unmeasured until now!

### The Solution (that nobody asked for)
Weepify scientifically tracks every tear with precision analytics! Log your crying sessions with intensity levels, duration, and reasons. Get beautiful charts showing your emotional journey, compete for crying streaks, and discover how many houseplants you could sustain with your tears. Because if you're going to cry, you might as well get some data out of it! 📊

## Technical Details
### Technologies/Components Used
For Software:
- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons (Font Awesome)
- **HTTP Client**: Axios
- **Routing**: React Router DOM

For Hardware:
- Modern computer with crying capabilities
- Internet connection for cloud tears storage
- Tissues (recommended but not required)
- Optional: Plants to water with calculated tear volume

### Implementation
For Software:

# Installation

## Backend Setup
```bash
cd backend
npm install
# Create .env file with your Supabase credentials
npm start
```

## Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

# Run
```bash
# Start Backend (Port 3000)
cd backend && npm start

# Start Frontend (Port 5173)
cd Frontend && npm run dev
```

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Login Page](screenshots/login-page.png)
*Beautiful login interface with animated tears falling in the background*

![Cry Form](screenshots/cry-form.png)
*Professional crying session logging form with intensity levels and mood tracking*

![History Dashboard](screenshots/history-dashboard.png)
*Comprehensive analytics dashboard showing lifetime tears, plants watered, and crying streaks with interactive charts*

![Statistics Charts](screenshots/charts.png)
*Beautiful Chart.js visualizations showing daily, weekly, and monthly crying patterns*

# Diagrams
![Architecture](diagrams/architecture.png)
*System architecture showing React frontend, Express backend, Supabase database, and JWT authentication flow*

## Features Implemented ✨
- 🔐 **User Authentication**: Secure JWT-based login/register system
- 😭 **Cry Logging**: Log crying sessions with date, time, duration, intensity, mood, and reason
- 📊 **Analytics Dashboard**: 
  - Lifetime tears shed (converted to liters)
  - Plants watered calculation (1ml = 0.01 plant)
  - Longest crying streak tracking
  - Total crying sessions count
- 📈 **Interactive Charts**: 
  - Daily tears chart (last 7 days)
  - Weekly analysis (last 4 weeks)  
  - Monthly trends (last 6 months)
- 🛡️ **Protected Routes**: Secure page access with authentication middleware
- 💧 **Animated UI**: Beautiful tear animations and responsive design
- 🌱 **Gamification**: Plant watering metaphors to make crying feel productive

## API Endpoints 🔌
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/crylogs` - Get all crying sessions
- `POST /api/crylogs` - Create new crying session
- `GET /api/crylogs/stats` - Get crying analytics
- `GET /api/crylogs/date/:date` - Get sessions by date

## Database Schema 🗄️
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  created_at TIMESTAMP
);

-- Cry logs table
CREATE TABLE cry_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  start_time TIME,
  duration INTEGER,
  intensity VARCHAR,
  mood_after VARCHAR,
  reason TEXT,
  tears_ml DECIMAL,
  created_at TIMESTAMP
);
```

### Project Demo
# Video
[Add your demo video link here]
*Complete walkthrough showing user registration, cry logging, and analytics dashboard with live charts*

# Additional Demos
- Live deployment: [Your deployed URL]
- Interactive charts showing real crying data
- Responsive design demo on mobile devices

## Team Contributions
- [Name 1]: Backend API development, database design, JWT authentication system
- [Name 2]: Frontend React components, Chart.js integration, UI/UX design
- [Name 3]: Full-stack integration, deployment, testing, and documentation

## Why This Project Matters (It Doesn't) 🤷‍♀️
Weepify addresses the critical gap in emotional data analytics. In a world obsessed with tracking steps, heart rate, and sleep patterns, we've finally brought scientific rigor to crying. Our advanced algorithms can tell you exactly how productive your emotional breakdowns have been!

## Future Enhancements (Because Why Stop Here?) 🚀
- 🌍 **Social Features**: Compare crying stats with friends
- 🏆 **Achievements**: Unlock badges for crying milestones
- 🤖 **AI Integration**: Predict optimal crying times
- 📱 **Mobile App**: Track tears on the go
- 🎵 **Spotify Integration**: Correlate crying with sad music
- 🌦️ **Weather API**: Track how weather affects crying patterns

---
Made with ❤️ and 💧 at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)

*"Because every tear deserves to be measured." - Weepify Team*