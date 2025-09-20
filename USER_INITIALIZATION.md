# User Initialization Feature

## Overview
This feature ensures that new users who log in (not using demo mode) start with zero values for all their metrics, providing a clean starting point for their financial literacy journey.

## What Gets Initialized to Zero

### User Metrics
- **Total Points**: 0 (starts fresh)
- **Completed Modules**: 0 (no modules completed)
- **Current Level**: 1 (beginner level)
- **Credit Score**: 0 (no credit history)
- **Achievements**: 0 (no achievements unlocked)
- **Streak**: 0 (no learning streak)

### Module Progress
All 6 modules start at 0% completion:
1. Budget Boss: 0%
2. Debt Destroyer: 0%
3. Emergency Fund Fortress: 0%
4. Investment Explorer: 0%
5. Credit Champion: 0%
6. Wealth Builder Pro: 0%

## How It Works

### Backend (Server)
1. **User Model** (`src/models/User.js`): Extended with all progress fields that default to 0
2. **User Routes** (`src/routes/userRoutes.js`): Automatically creates new users with zero values
3. **Authentication**: When a user logs in via Auth0, the system checks if they exist in the database
4. **Auto-Creation**: If user doesn't exist, creates new user with all metrics set to 0

### Frontend (Client)
1. **useUser Hook** (`src/hooks/useUser.ts`): Manages user data fetching and updates
2. **Dashboard** (`src/pages/Dashboard.tsx`): Displays real user data or zero values for new users
3. **Modules** (`src/pages/Modules.tsx`): Shows actual progress starting from 0
4. **Demo Mode Toggle**: Allows users to switch between their real progress and demo data

## Demo Mode vs Real User Data

### Demo Mode (Toggle ON)
- Shows sample data: 150 points, 1 completed module, 720 credit score
- Used for showcasing the app's features
- Doesn't affect real user progress

### Real User Data (Toggle OFF - Default)
- New users: All metrics start at 0
- Existing users: Shows their actual progress
- Data is saved to MongoDB and persists across sessions

## Database Schema

```javascript
{
  auth0Id: String,           // Auth0 user ID
  name: String,              // User's name
  email: String,             // User's email
  totalPoints: Number,       // Default: 0
  completedModules: Number,  // Default: 0
  currentLevel: Number,      // Default: 1
  creditScore: Number,       // Default: 0
  achievements: Number,      // Default: 0
  streak: Number,            // Default: 0
  moduleProgress: Map,       // All modules start at 0
  preferences: Object,       // User settings
  createdAt: Date           // Account creation date
}
```

## API Endpoints

- `GET /api/users/profile` - Get or create user profile
- `PUT /api/users/progress` - Update user progress
- `PUT /api/users/preferences` - Update user preferences

## Benefits

1. **Clean Start**: New users begin with a fresh slate
2. **Motivation**: Users can see their progress grow from 0
3. **Realistic**: Reflects actual learning journey
4. **Flexible**: Demo mode still available for showcasing
5. **Persistent**: Progress is saved and maintained across sessions

## Usage

1. User logs in via Auth0
2. System automatically creates user record with zero values
3. User sees their starting progress (all zeros)
4. As they complete modules, progress updates in real-time
5. Demo mode toggle allows switching to sample data for demonstration
