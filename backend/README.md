# 😭 Weepify Backend

A fun and therapeutic backend API for tracking crying sessions! Built with Node.js, Express, and Supabase.

## 🚀 Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Add your Supabase credentials to the `.env` file:
   ```env
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=3001
   ```

3. **Set up your Supabase database** (see Database Setup section below)

4. **Start the server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Visit the API**:
   - Main endpoint: `http://localhost:3001`
   - API base: `http://localhost:3001/api`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `POST /api/auth/logout` - User logout (protected)

### Crying Sessions (All Protected - Require Authentication)
- `GET /api/crylogs` - Get all crying sessions for authenticated user
- `POST /api/crylogs` - Log a new crying session
- `GET /api/crylogs/stats` - Get crying analytics for authenticated user
- `GET /api/crylogs/date/:date` - Get sessions by specific date
- `GET /api/crylogs/:id` - Get specific session
- `PUT /api/crylogs/:id` - Update a session
- `DELETE /api/crylogs/:id` - Delete a session

### Sample Registration Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe"
}
```

### Sample Login Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Authentication Headers
For all protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer your-jwt-token-here
```

### Sample POST Request
```json
{
  "mood_after": "relieved",
  "reason": "work stress",
  "duration": 15,
  "intensity": "moderate",
  "cry_date": "2025-08-01",
  "start_time": "14:30",
  "notes": "Had a really tough day at work..."
}
```

### Intensity Levels
- `low` - Light crying/tears
- `moderate` - Regular crying session  
- `high` - Intense crying session

## 🗂️ Project Structure

```
backend/
├── server.js                # Main server file
├── .env                     # Environment variables
├── routes/
│   └── cryLogs.js          # API route definitions
├── controllers/
│   └── cryLogsController.js # Business logic
├── supabase/
│   └── client.js           # Database connection
└── utils/
    └── calculator.js       # Helper functions
```

## 🗄️ Database Setup (Supabase)

Create these tables in your Supabase database:

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
```

### Cry Logs Table
```sql
CREATE TABLE cry_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_after TEXT NOT NULL,
  reason TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'moderate', 'high')),
  cry_date DATE NOT NULL,
  start_time TIME NOT NULL,
  notes TEXT,
  tear_volume DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX idx_cry_logs_user_id ON cry_logs(user_id);
CREATE INDEX idx_cry_logs_cry_date ON cry_logs(cry_date);
```

## 🎯 Features

- **🔐 JWT Authentication**: Secure user registration and login
- **👤 User Management**: Profile management and password changes  
- **🛡️ Protected Routes**: All crying data is user-specific and protected
- **Real-time Data**: All operations work with your Supabase database
- **Tear Volume Calculator**: Fun calculation based on duration and intensity
- **Mood Trend Analysis**: Tracks emotional patterns over time
- **Date-based Queries**: Filter sessions by specific dates
- **Input Validation**: Comprehensive validation for all fields
- **Error Handling**: Proper error responses and logging

## 🧪 Testing the API

### 1. Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "password123"
  }'
```

### 3. Use the JWT token from login response:
```bash
# Get all sessions (replace YOUR_JWT_TOKEN with actual token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/crylogs

# Create a new session
curl -X POST http://localhost:3001/api/crylogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "mood_after": "relieved",
    "reason": "stress relief",
    "duration": 10,
    "intensity": "moderate",
    "cry_date": "2025-08-02",
    "start_time": "15:30"
  }'

# Get statistics
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/crylogs/stats
```

### Using a REST client:
- Use Postman, Insomnia, or VS Code REST Client extension
- Import the endpoints and test with real data

---

*Remember: Crying is healthy and therapeutic! This app celebrates emotional expression in a fun, supportive way.* 😭💪
