import express from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question.js';
import College from '../models/College.js';
import User from '../models/User.js';
import Result from '../models/Result.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalColleges = await College.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalTests = await Result.countDocuments();

    // Recent activity
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentTests = await Result.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalColleges,
          totalQuestions,
          totalTests
        },
        recentUsers,
        recentTests
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @desc    Get all questions (Admin)
// @route   GET /api/admin/questions
// @access  Private (Admin)
router.get('/questions', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isActive } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalQuestions: total
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions'
    });
  }
});

// @desc    Create new question
// @route   POST /api/admin/questions
// @access  Private (Admin)
router.post('/questions', [
  body('text')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Question text must be at least 10 characters'),
  body('options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Question must have 2-6 options'),
  body('options.*.label')
    .trim()
    .notEmpty()
    .withMessage('Option label is required'),
  body('options.*.value')
    .trim()
    .notEmpty()
    .withMessage('Option value is required'),
  body('options.*.tags')
    .isArray({ min: 1 })
    .withMessage('Each option must have at least one tag')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question'
    });
  }
});

// @desc    Update question
// @route   PUT /api/admin/questions/:id
// @access  Private (Admin)
router.put('/questions/:id', [
  body('text')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Question text must be at least 10 characters'),
  body('options')
    .optional()
    .isArray({ min: 2, max: 6 })
    .withMessage('Question must have 2-6 options')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating question'
    });
  }
});

// @desc    Delete question
// @route   DELETE /api/admin/questions/:id
// @access  Private (Admin)
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question'
    });
  }
});

// @desc    Get all colleges (Admin)
// @route   GET /api/admin/colleges
// @access  Private (Admin)
router.get('/colleges', async (req, res) => {
  try {
    const { page = 1, limit = 10, state, isActive } = req.query;
    
    const filter = {};
    if (state) filter['location.state'] = { $regex: state, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const colleges = await College.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await College.countDocuments(filter);

    res.json({
      success: true,
      data: {
        colleges,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalColleges: total
        }
      }
    });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching colleges'
    });
  }
});

// @desc    Create new college
// @route   POST /api/admin/colleges
// @access  Private (Admin)
router.post('/colleges', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('streams')
    .isArray({ min: 1 })
    .withMessage('At least one stream is required'),
  body('interestTags')
    .isArray({ min: 1 })
    .withMessage('At least one interest tag is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const college = await College.create(req.body);

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: {
        college
      }
    });
  } catch (error) {
    console.error('Create college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating college'
    });
  }
});

// @desc    Update college
// @route   PUT /api/admin/colleges/:id
// @access  Private (Admin)
router.put('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      message: 'College updated successfully',
      data: {
        college
      }
    });
  } catch (error) {
    console.error('Update college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating college'
    });
  }
});

// @desc    Delete college
// @route   DELETE /api/admin/colleges/:id
// @access  Private (Admin)
router.delete('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting college'
    });
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    const filter = { role: { $ne: 'admin' } }; // Exclude admins
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @desc    Toggle user status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin)
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify admin status'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling user status'
    });
  }
});

// @desc    Get all test results (Admin)
// @route   GET /api/admin/test-results
// @access  Private (Admin)
router.get('/test-results', async (req, res) => {
  try {
    const { page = 1, limit = 50, userId } = req.query;
    
    const filter = {};
    if (userId) filter.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Result.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Result.countDocuments(filter);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalResults: total
        }
      }
    });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching test results'
    });
  }
});

export default router; 