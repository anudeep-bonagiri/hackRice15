import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // User identification
  username: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  
  // Additional user profile data
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  
  // Financial profile
  income: { type: Number, min: 0 },
  employmentStatus: {
    type: String,
    enum: ['employed', 'unemployed', 'student', 'self-employed', 'retired', 'other']
  },
  creditScore: { type: Number, min: 300, max: 850 },
  
  // Points and rewards system (combining both schemas)
  points: { type: Number, default: 0, min: 0 },
  totalPoints: { type: Number, default: 0 }, // for compatibility with remote
  totalPointsEarned: { type: Number, default: 0, min: 0 }, // lifetime points
  pointsRedeemed: { type: Number, default: 0, min: 0 },
  
  // XP and progression system
  xp: { type: Number, default: 0, min: 0 },
  currentLevel: { type: Number, default: 1 }, // for compatibility with remote
  streak: { type: Number, default: 0, min: 0 },
  lastActiveDate: { type: String, default: () => new Date().toISOString() },
  currentStage: { 
    type: String, 
    enum: ['Tadpole', 'Froglet', 'Young Frog', 'Wise Frog'],
    default: 'Tadpole'
  },
  
  // Microcredit eligibility and scoring
  microcreditEligible: { type: Boolean, default: false },
  microcreditScore: { type: Number, default: 0, min: 0, max: 100 },
  microcreditHistory: [{
    amount: Number,
    dateApproved: Date,
    dateRepaid: Date,
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'active', 'repaid', 'defaulted'],
      default: 'pending'
    },
    repaymentScore: { type: Number, min: 0, max: 100 } // how well they repaid
  }],
  
  // Learning progress (enhanced to support both schemas)
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  completedModulesCount: { type: Number, default: 0 }, // for compatibility
  moduleProgress: {
    type: Map,
    of: Number,
    default: new Map([
      ['1', 0], // Budget Boss
      ['2', 0], // Debt Destroyer
      ['3', 0], // Emergency Fund Fortress
      ['4', 0], // Investment Explorer
      ['5', 0], // Credit Champion
      ['6', 0]  // Wealth Builder Pro
    ])
  },
  
  // Achievements and badges (supporting both formats)
  achievements: [{ type: String }],
  achievementsCount: { type: Number, default: 0 }, // for compatibility
  badges: [{ type: String }],
  
  // Financial goals and tracking
  savingsGoals: [{
    title: String,
    targetAmount: Number,
    currentAmount: { type: Number, default: 0 },
    deadline: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  }],
  
  // Preferences and settings (merged from both schemas)
  preferences: {
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      shareProgress: { type: Boolean, default: false },
      showOnLeaderboard: { type: Boolean, default: true }
    },
    theme: { type: String, default: 'light' } // from remote
  },
  
  // Verification status
  verified: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false }
  },
  
  // Persona identity verification data
  personaVerification: {
    inquiryId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'] },
    completedAt: { type: Date },
    verificationData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  
  // Last updated timestamp
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for user's current level based on XP
userSchema.virtual('level').get(function() {
  if (this.xp < 100) return 1;
  if (this.xp < 300) return 2;
  if (this.xp < 600) return 3;
  if (this.xp < 1000) return 4;
  return Math.floor(this.xp / 200) + 1;
});

// Method to award points and XP
userSchema.methods.awardPoints = function(points, xp = 0) {
  this.points += points;
  this.totalPointsEarned += points;
  if (xp > 0) {
    this.xp += xp;
  }
  return this.save();
};

// Method to check microcredit eligibility
userSchema.methods.updateMicrocreditEligibility = function() {
  let score = 0;
  
  // Base score from XP and learning progress
  if (this.xp >= 500) score += 20;
  if (this.completedModules.length >= 5) score += 15;
  if (this.streak >= 7) score += 10;
  
  // Financial stability indicators
  if (this.income && this.income > 0) score += 20;
  if (this.creditScore && this.creditScore >= 650) score += 15;
  
  // Verification bonus
  if (this.verified.email) score += 5;
  if (this.verified.phone) score += 5;
  if (this.verified.identity) score += 10;
  
  // Repayment history bonus
  const repaidLoans = this.microcreditHistory.filter(loan => loan.status === 'repaid');
  if (repaidLoans.length > 0) {
    const avgRepaymentScore = repaidLoans.reduce((sum, loan) => sum + (loan.repaymentScore || 0), 0) / repaidLoans.length;
    score += Math.min(avgRepaymentScore * 0.2, 20); // Max 20 points from repayment history
  }
  
  this.microcreditScore = Math.min(score, 100);
  this.microcreditEligible = score >= 60; // 60+ score makes them eligible
  
  return this.save();
};

// Method to add completed module and update progress
userSchema.methods.completeModule = function(moduleId, pointsAwarded = 50, xpAwarded = 100) {
  if (!this.completedModules.includes(moduleId)) {
    this.completedModules.push(moduleId);
    this.moduleProgress.set(moduleId.toString(), 100);
    return this.awardPoints(pointsAwarded, xpAwarded);
  }
  return Promise.resolve(this);
};

export default mongoose.model("User", userSchema);
