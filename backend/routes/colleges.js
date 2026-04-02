import express from 'express';
import College from '../models/College.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all colleges with filters and pagination
// @route   GET /api/colleges
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      state = '',
      city = '',
      stream = '',
      minRating = '',
      maxRating = ''
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (stream) {
      filter.streams = { $in: [stream] };
    }

    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const colleges = await College.find(filter)
      .sort({ rating: -1, rank: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('courses');

    const total = await College.countDocuments(filter);

    // Check if colleges are saved by current user
    let collegesWithSavedStatus = colleges;
    if (req.user) {
      collegesWithSavedStatus = colleges.map(college => ({
        ...college.toObject(),
        isSaved: req.user.savedColleges.includes(college._id)
      }));
    }

    res.json({
      success: true,
      data: {
        colleges: collegesWithSavedStatus,
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

// @desc    Get available filters
// @route   GET /api/colleges/filters
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    const states = await College.distinct('location.state');
    const cities = await College.distinct('location.city');
    const streams = await College.distinct('streams');
    const tags = await College.distinct('interestTags');

    res.json({
      success: true,
      data: {
        states: states.sort(),
        cities: cities.sort(),
        streams: streams.sort(),
        tags: tags.sort()
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching filters'
    });
  }
});

// @desc    Get college statistics
// @route   GET /api/colleges/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalColleges = await College.countDocuments({ isActive: true });
    const states = await College.distinct('location.state');
    const streams = await College.distinct('streams');
    const tags = await College.distinct('interestTags');

    // Get top rated colleges
    const topRatedColleges = await College.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(5)
      .select('name location rating');

    res.json({
      success: true,
      data: {
        totalColleges,
        totalStates: states.length,
        totalStreams: streams.length,
        totalTags: tags.length,
        topRatedColleges
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

// @desc    Get colleges by stream
// @route   GET /api/colleges/stream/:stream
// @access  Public
router.get('/stream/:stream', optionalAuth, async (req, res) => {
  try {
    const { stream } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const filter = {
      isActive: true,
      streams: { $in: [stream] }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const colleges = await College.find(filter)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('courses');

    const total = await College.countDocuments(filter);

    // Check if colleges are saved by current user
    let collegesWithSavedStatus = colleges;
    if (req.user) {
      collegesWithSavedStatus = colleges.map(college => ({
        ...college.toObject(),
        isSaved: req.user.savedColleges.includes(college._id)
      }));
    }

    res.json({
      success: true,
      data: {
        colleges: collegesWithSavedStatus,
        stream,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalColleges: total
        }
      }
    });
  } catch (error) {
    console.error('Get colleges by stream error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching colleges by stream'
    });
  }
});

// @desc    Get college by ID
// @route   GET /api/colleges/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('courses');

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    if (!college.isActive) {
      return res.status(404).json({
        success: false,
        message: 'College is not available'
      });
    }

    // Check if college is saved by current user
    let collegeData = college.toObject();
    if (req.user) {
      collegeData.isSaved = req.user.savedColleges.includes(college._id);
    }

    res.json({
      success: true,
      data: {
        college: collegeData
      }
    });
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching college'
    });
  }
});

export default router; 