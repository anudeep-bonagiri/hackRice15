# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Context

This is a HackRice 2024 hackathon submission project. The hackathon has specific requirements:
- **Submission Deadline**: Sunday, 9/21, 9:00 AM
- **Video Requirement**: 3-4 minute demo video for Devpost submission
- **Track Limit**: Choose AT MOST 1 track
- **Challenges**: Can choose MULTIPLE challenges

## Repository Structure

```
hackrice-2024/
├── src/           # Source code (currently empty)
├── assets/        # Static assets (images, data files)
├── docs/          # Hackathon documentation and requirements
│   ├── HACKATHON_INFO.md      # Submission requirements
│   └── PRIZES_AND_TRACKS.md   # Available prizes and challenges
└── README.md      # Project overview template
```

## Development Workflow

Since this project supports multiple technology stacks (based on .gitignore), common development patterns include:

### For Web Projects
```bash
# If using Node.js
npm install
npm start
npm run build
npm test

# If using Python
pip install -r requirements.txt
python -m pytest
python app.py
```

### For Other Stacks
The .gitignore suggests support for:
- **Python**: Use `python -m pytest` for testing, `python app.py` or `flask run` for running
- **Node.js**: Use `npm` or `yarn` for package management
- **Java**: Use `mvn` or `gradle` for build management
- **Go**: Use `go run main.go`, `go build`, `go test ./...`
- **Rust**: Use `cargo run`, `cargo build`, `cargo test`

## Hackathon-Specific Commands

### Video Submission Structure
Your demo video should follow this 3-4 minute outline:
1. **Intro (30s)**: Project name, team, track/challenge, purpose, tech stack
2. **Demo (2m)**: Live project demonstration
3. **Technical Design (30s)**: High-level architecture overview
4. **Impact (30s)**: Real-world value and future improvements

### Git Workflow
```bash
# Initial setup after cloning
git remote -v  # Verify remote connections

# Regular development
git add .
git commit -m "feat: implement [feature description]"
git push origin main

# Check project status
git status
git log --oneline -5
```

## Prize Categories to Consider

### Main Tracks (choose 1):
- Social Impact Track ($200 cash)
- Healthcare Track (Gaming monitor + mechanical keyboard)
- Productivity and Education Track ($200 gift cards)
- Finance & Entrepreneurship Track (Electric scooter)

### Notable Challenges (choose multiple):
- **MongoDB Atlas**: M5GO IoT Starter Kit
- **Auth0**: Wireless headphones  
- **Gemini API**: Google swag
- **Cloudflare AI**: Arduino kit
- **Capital One Financial**: $250 Amazon gift cards
- **Warp Developer Tool**: Keychron keyboards

## Architecture Considerations

When implementing your project, consider these hackathon-optimized patterns:

### MVP Development
- Focus on core functionality first
- Use established frameworks and libraries
- Prioritize features that demo well in video format

### Technology Integration
- If using MongoDB Atlas: Set up with $50 student credit or free tier
- If using Auth0: Implement social sign-in, MFA, or passwordless login
- If using Gemini API: Focus on language understanding, data analysis, or content generation
- If using Cloudflare: Leverage Workers AI, C3, or object storage

### Demo Preparation
- Ensure your project runs reliably in a demo environment
- Prepare fallback scenarios for live demonstrations
- Test video recording setup before the deadline

## Important Notes

- This repository was initialized for HackRice 2024 (hackrice.com)
- Submit through Devpost before Sunday 9/21 at 9:00 AM
- The referenced setup repository (jrbros123/hackrice-2025.git) appears to be empty
- Actual technology stack will be determined based on chosen track and implementation approach