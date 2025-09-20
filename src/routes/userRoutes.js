import express from "express";
import User from "../models/User.js";
import { checkJwt, getUser } from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(checkJwt);
router.use(getUser);

// Get or create user profile
router.get("/profile", async (req, res) => {
  try {
    const auth0Id = req.user.id;
    
    // Try to find existing user
    let user = await User.findOne({ auth0Id });
    
    // If user doesn't exist, create new user with zero values
    if (!user) {
      user = new User({
        auth0Id,
        name: req.user.name || "New User",
        email: req.user.email || "",
        // All progress fields will use default values (0) from schema
      });
      
      await user.save();
      console.log("✅ New user created with zero progress:", user.auth0Id);
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        completedModules: user.completedModules,
        currentLevel: user.currentLevel,
        creditScore: user.creditScore,
        achievements: user.achievements,
        streak: user.streak,
        moduleProgress: Object.fromEntries(user.moduleProgress),
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("❌ Error getting user profile:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to get user profile" 
    });
  }
});

// Update user progress (for when they complete modules, etc.)
router.put("/progress", async (req, res) => {
  try {
    const auth0Id = req.user.id;
    const { totalPoints, completedModules, currentLevel, creditScore, achievements, streak, moduleProgress } = req.body;
    
    const updateData = {};
    if (totalPoints !== undefined) updateData.totalPoints = totalPoints;
    if (completedModules !== undefined) updateData.completedModules = completedModules;
    if (currentLevel !== undefined) updateData.currentLevel = currentLevel;
    if (creditScore !== undefined) updateData.creditScore = creditScore;
    if (achievements !== undefined) updateData.achievements = achievements;
    if (streak !== undefined) updateData.streak = streak;
    if (moduleProgress !== undefined) updateData.moduleProgress = new Map(Object.entries(moduleProgress));
    
    const user = await User.findOneAndUpdate(
      { auth0Id },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        completedModules: user.completedModules,
        currentLevel: user.currentLevel,
        creditScore: user.creditScore,
        achievements: user.achievements,
        streak: user.streak,
        moduleProgress: Object.fromEntries(user.moduleProgress),
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error("❌ Error updating user progress:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update user progress" 
    });
  }
});

// Update user preferences
router.put("/preferences", async (req, res) => {
  try {
    const auth0Id = req.user.id;
    const { preferences } = req.body;
    
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { preferences },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    console.error("❌ Error updating user preferences:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update user preferences" 
    });
  }
});

export default router;
