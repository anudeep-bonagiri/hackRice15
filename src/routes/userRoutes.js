import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get("/profile", async (req, res) => {
  try {
    // In a real app, you'd get the user ID from the JWT token
    // For now, we'll use a query parameter or find by auth0Id
    const { auth0Id } = req.query;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }
    
    const user = await User.findOne({ auth0Id }).populate('completedModules');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/profile - Create or update user profile
router.post("/profile", async (req, res) => {
  try {
    const { auth0Id } = req.body;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }
    
    const user = await User.findOneAndUpdate(
      { auth0Id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile/financial - Update financial information
router.put("/profile/financial", async (req, res) => {
  try {
    const { auth0Id, income, employmentStatus, creditScore } = req.body;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }
    
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { income, employmentStatus, creditScore },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Recalculate microcredit eligibility after financial update
    await user.updateMicrocreditEligibility();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/points/award - Award points to user
router.post("/points/award", async (req, res) => {
  try {
    const { auth0Id, points, xp, reason } = req.body;
    
    if (!auth0Id || !points) {
      return res.status(400).json({ error: "auth0Id and points are required" });
    }
    
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    await user.awardPoints(points, xp || 0);
    
    // Recalculate microcredit eligibility after points/XP update
    await user.updateMicrocreditEligibility();
    
    res.json({ 
      message: `Awarded ${points} points${xp ? ` and ${xp} XP` : ''} to user`,
      user: {
        points: user.points,
        totalPointsEarned: user.totalPointsEarned,
        xp: user.xp,
        level: user.level,
        microcreditEligible: user.microcreditEligible,
        microcreditScore: user.microcreditScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/modules/complete - Mark module as completed
router.post("/modules/complete", async (req, res) => {
  try {
    const { auth0Id, moduleId, pointsAwarded, xpAwarded } = req.body;
    
    if (!auth0Id || !moduleId) {
      return res.status(400).json({ error: "auth0Id and moduleId are required" });
    }
    
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    await user.completeModule(moduleId, pointsAwarded, xpAwarded);
    await user.updateMicrocreditEligibility();
    
    res.json({
      message: "Module completed successfully",
      user: {
        completedModules: user.completedModules,
        points: user.points,
        xp: user.xp,
        level: user.level,
        microcreditEligible: user.microcreditEligible,
        microcreditScore: user.microcreditScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/microcredit/eligibility - Check microcredit eligibility
router.get("/microcredit/eligibility", async (req, res) => {
  try {
    const { auth0Id } = req.query;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }
    
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Update eligibility before returning
    await user.updateMicrocreditEligibility();
    
    res.json({
      eligible: user.microcreditEligible,
      score: user.microcreditScore,
      requirements: {
        minScore: 60,
        currentScore: user.microcreditScore,
        factors: {
          xp: user.xp,
          completedModules: user.completedModules.length,
          streak: user.streak,
          income: user.income ? 'Provided' : 'Not provided',
          creditScore: user.creditScore || 'Not provided',
          verified: user.verified
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/verification/update - Update verification status
router.post("/verification/update", async (req, res) => {
  try {
    const { auth0Id, type, status } = req.body;
    
    if (!auth0Id || !type || status === undefined) {
      return res.status(400).json({ error: "auth0Id, type, and status are required" });
    }
    
    if (!['email', 'phone', 'identity'].includes(type)) {
      return res.status(400).json({ error: "Invalid verification type" });
    }
    
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.verified[type] = status;
    await user.save();
    await user.updateMicrocreditEligibility();
    
    res.json({
      message: `${type} verification updated`,
      verified: user.verified,
      microcreditEligible: user.microcreditEligible,
      microcreditScore: user.microcreditScore
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/stats - Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const { auth0Id } = req.query;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }
    
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      points: {
        current: user.points,
        totalEarned: user.totalPointsEarned,
        redeemed: user.pointsRedeemed
      },
      progress: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        completedModules: user.completedModules.length,
        currentStage: user.currentStage
      },
      microcredit: {
        eligible: user.microcreditEligible,
        score: user.microcreditScore,
        historyCount: user.microcreditHistory.length
      },
      achievements: user.achievements,
      badges: user.badges,
      verified: user.verified
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;