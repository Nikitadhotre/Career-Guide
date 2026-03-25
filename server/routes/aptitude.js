import express from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import College from '../models/College.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get aptitude test questions
// @route   GET /api/aptitude/questions
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .limit(20); // Limit to 20 questions for the test

    res.json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length
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

// @desc    Submit aptitude test answers
// @route   POST /api/aptitude/submit
// @access  Private
router.post('/submit', [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('At least one answer is required'),
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Invalid question ID'),
  body('answers.*.selectedOption')
    .notEmpty()
    .withMessage('Selected option is required')
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

    const { answers } = req.body;
    const userId = req.user._id;

    // Get questions to validate answers and extract tags
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length !== answers.length) {
      return res.status(400).json({
        success: false,
        message: 'Some questions not found'
      });
    }

    // Process answers and collect tags
    const processedAnswers = [];
    const allTags = new Set();

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const selectedOption = question.options.find(opt => opt.value === answer.selectedOption);
      
      if (!selectedOption) {
        return res.status(400).json({
          success: false,
          message: 'Invalid option selected for a question'
        });
      }

      // Add tags from selected option
      selectedOption.tags.forEach(tag => allTags.add(tag));

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        tags: selectedOption.tags
      });
    }

    // Convert tags set to array
    const matchedTags = Array.from(allTags);

    // Create result record
    const result = await Result.create({
      userId,
      answers: processedAnswers,
      matchedTags,
      totalQuestions: answers.length,
      score: Math.round((matchedTags.length / answers.length) * 100)
    });

    // Find colleges based on matched tags
    const colleges = await College.find({
      isActive: true,
      interestTags: { $in: matchedTags }
    })
    .sort({ rating: -1, rank: 1 })
    .limit(10)
    .populate('courses');

    // Calculate match scores for recommendations
    const recommendations = colleges.map(college => {
      const matchScore = result.calculateMatchScore(college.interestTags);
      return {
        collegeId: college._id,
        matchScore,
        reason: `Matches ${matchScore}% of your interests`
      };
    });

    // Sort recommendations by match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Update result with recommendations
    result.recommendations = recommendations;
    await result.save();

    // Add result to user's test history
    await req.user.updateOne({
      $push: {
        testHistory: {
          testId: result._id,
          date: new Date()
        }
      }
    });

    res.json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        result: {
          id: result._id,
          matchedTags,
          score: result.score,
          totalQuestions: result.totalQuestions,
          completedAt: result.completedAt
        },
        recommendations: recommendations.slice(0, 5), // Top 5 recommendations
        colleges: colleges.slice(0, 5) // Top 5 colleges
      }
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting test'
    });
  }
});

// @desc    Get user's test history
// @route   GET /api/aptitude/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('recommendations.collegeId', 'name location rating');

    res.json({
      success: true,
      data: {
        results
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching test history'
    });
  }
});

// @desc    Get specific test result
// @route   GET /api/aptitude/result/:id
// @access  Private
router.get('/result/:id', protect, async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('recommendations.collegeId');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found'
      });
    }

    res.json({
      success: true,
      data: {
        result
      }
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching test result'
    });
  }
});

export default router; 