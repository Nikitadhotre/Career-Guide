import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
});

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  matchedTags: [{
    type: String,
    required: true
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  recommendations: [{
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    reason: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ matchedTags: 1 });

// Calculate match score for recommendations
resultSchema.methods.calculateMatchScore = function(collegeTags) {
  if (!this.matchedTags || !collegeTags) return 0;
  
  const userTags = new Set(this.matchedTags);
  const collegeTagSet = new Set(collegeTags);
  
  const intersection = new Set([...userTags].filter(tag => collegeTagSet.has(tag)));
  const union = new Set([...userTags, ...collegeTagSet]);
  
  return Math.round((intersection.size / union.size) * 100);
};

export default mongoose.model('Result', resultSchema); 