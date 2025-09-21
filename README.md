## Inspiration
There are around 24 million unbanked or underbanked adults in the US. This is a silent catastrophe that goes under the radar in society and needs to be thoroughly addressed. Many students who graduate high school and even college don’t understand the basics of budgeting, finance, stocks, investment, savings, or credit. We built this program GrowFi to form a specially curated program that assuredly shows and teaches people how they have been missing out on hundreds and thousands of dollars. 


## What it does
GrowFi is a gamified financial literacy platform that combines educational content with a comprehensive user management system, featuring points tracking, XP progression, and microcredit eligibility scoring.
🎯 Goal tracking: users can set savings or budgeting goals (e.g., save $500 in 3 months).
📊 Dashboards: visualize progress on goals and learning modules.
📚 Interactive modules & quizzes to teach financial concepts in a fun way.


## How we built it
🏗️ Tech Stack
•  Frontend: React 18, TypeScript, Vite
•  Backend: Node.js, Express.js
•  Database: MongoDB Atlas

🔧 Key Development Phases

Phase 1: MongoDB Integration
•  Set up MongoDB Atlas cluster connection
•  Built comprehensive User schema with 15+ data fields
•  Created API endpoints for user management (/api/users/*)
•  Implemented points system, XP tracking, and progress monitoring

Phase 2: User Management System
•  Enhanced User Model: Username-based identification, financial profiles, microcredit scoring
•  Smart Features: Automatic eligibility calculations, level progression, achievement tracking
•  API Endpoints: Profile management, points awarding, module completion, verification system

Phase 3: Simplification & Cleanup
•  Removed Auth0 complexity for hackathon simplicity
•  Streamlined authentication to username-based system
•  Cleaned up routing and component structure
•  Focused on core functionality over complex auth flows

🎮 Core Features Built

Gamification System
•  Points & XP: Award system for completing lessons and activities
•  Level Progression: Tadpole → Froglet → Young Frog → Wise Frog
•  Streak Tracking: Daily engagement rewards
•  Achievement System: Unlockable badges and milestones

Financial Tracking
•  User Profiles: Income, employment status, credit scores
•  Microcredit Scoring: Algorithm-based eligibility (0-100 scale)
•  Progress Monitoring: Module completion tracking
•  Goals System: Savings targets and financial objectives


## Challenges we ran into
1. Database Connection & Authentication Complexity
•  Challenge: Initially had Auth0 integration that created authentication barriers
•  Problem: Complex user identification system (auth0Id) made development slower
•  Solution: Simplified to username-based system while preserving all user data functionality
•  Impact: Made app more accessible and development more agile

2. Comprehensive User Data Management 
•  Challenge: Storing diverse user data (financial, gamification, progress, verification)
•  Problem: MongoDB Map fields with mixed data types causing validation errors
•  Solution: Careful schema design with proper string keys, nested objects, and validation rules
•  Result: Successfully tracks 15+ data points per user seamlessly

3. Real-time Progress Tracking
•  Challenge: Creating a system that feels personal and responsive to user actions
•  Problem: Static progress indicators don't motivate continued engagement
•  Solution: Built dynamic XP system with instant feedback, level progression, and visual rewards
•  Innovation: Tadpole → Frog evolution creates emotional connection to growth


## What we learned
Technical Insights
•  Simplicity Wins: Removing Auth0 complexity made development 3x faster and eliminated authentication barriers for users
•  Database Schema Design: MongoDB's flexibility allowed us to iterate rapidly on user data structure - learned to plan for nested objects and Map fields upfront
•  API-First Development: Building robust backend APIs first made frontend integration seamless
•  Real-time Calculations: Implementing automatic microcredit scoring taught us about database middleware and reactive systems

Product Development Lessons
•  Gamification Psychology: Users need immediate rewards (XP/points) for long-term educational goals
•  Progressive Disclosure: Start simple (username/email) then gradually collect financial data as trust builds
•  Visual Progress Matters: Abstract numbers (credit scores) need visual representations to motivate users
•  Personal Stakes Work: Real-world benefits (microcredit eligibility) drive engagement more than badges alone

User Experience Discoveries
•  Emotional Connection: The mascot evolution (Tadpole → Frog) creates surprising attachment to progress
•  Data Transparency: Users want to see exactly how their actions affect their scores/eligibility
•  Immediate Feedback: Every user action should provide instant visual or numerical response

Development Process Insights
•  Hackathon Speed: Clean, minimal architecture allows rapid feature development
•  Full-Stack Benefits: Controlling both frontend and backend enables seamless user experiences
•  Testing Early: API testing with curl commands caught integration issues before frontend work


## What's next for Growfi

Immediate Features (Next 30 Days)
•  Content Integration: Add actual financial literacy modules with video content
•  Goal Setting: Implement savings goal tracking with progress visualization  
•  Social Features: Leaderboards, peer comparisons, study groups
•  Mobile Optimization: Responsive design improvements for mobile learning
 Expansion (3-6 Months)
•  Real Microcredit Partner: Integrate with actual lenders for $500-$7000 loans
•  Credit Score Integration: Connect to real credit monitoring services
•  Advanced Gamification: Achievement trees, learning streaks, seasonal challenges
•  AI Recommendations: Personalized learning paths based on user financial situation