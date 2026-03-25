import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import College from '../models/College.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Save college to user's bookmarks
// @route   POST /api/user/save-college
// @access  Private
router.post('/save-college', [
  body('collegeId')
    .isMongoId()
    .withMessage('Invalid college ID')
], protect, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { collegeId } = req.body;
    const userId = req.user._id;

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if college is already saved
    const isAlreadySaved = req.user.savedColleges.includes(collegeId);
    if (isAlreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'College is already saved'
      });
    }

    // Add college to saved colleges
    await User.findByIdAndUpdate(userId, {
      $push: { savedColleges: collegeId }
    });

    res.json({
      success: true,
      message: 'College saved successfully'
    });
  } catch (error) {
    console.error('Save college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving college'
    });
  }
});

// @desc    Remove college from user's bookmarks
// @route   DELETE /api/user/remove-college/:collegeId
// @access  Private
router.delete('/remove-college/:collegeId', protect, async (req, res) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user._id;

    // Check if college is saved
    const isSaved = req.user.savedColleges.includes(collegeId);
    if (!isSaved) {
      return res.status(400).json({
        success: false,
        message: 'College is not in your saved list'
      });
    }

    // Remove college from saved colleges
    await User.findByIdAndUpdate(userId, {
      $pull: { savedColleges: collegeId }
    });

    res.json({
      success: true,
      message: 'College removed from saved list'
    });
  } catch (error) {
    console.error('Remove college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing college'
    });
  }
});

// @desc    Get user's saved colleges
// @route   GET /api/user/saved-colleges
// @access  Private
router.get('/saved-colleges', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedColleges',
        select: 'name location rating streams interestTags courses website',
        match: { isActive: true }
      });

    res.json({
      success: true,
      data: {
        savedColleges: user.savedColleges
      }
    });
  } catch (error) {
    console.error('Get saved colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching saved colleges'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], protect, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      updateData.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedColleges', 'name location rating');

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('testHistory.testId');

    const totalTests = user.testHistory.length;
    const savedCollegesCount = user.savedColleges.length;
    
    // Calculate average score from test history
    let averageScore = 0;
    if (totalTests > 0) {
      const totalScore = user.testHistory.reduce((sum, test) => {
        return sum + (test.testId?.score || 0);
      }, 0);
      averageScore = Math.round(totalScore / totalTests);
    }

    res.json({
      success: true,
      data: {
        totalTests,
        savedCollegesCount,
        averageScore,
        memberSince: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

export default router; 