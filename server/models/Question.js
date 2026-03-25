import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }]
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [optionSchema],
  category: {
    type: String,
    enum: ['aptitude', 'personality', 'interest'],
    default: 'aptitude'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, isActive: 1, order: 1 });

export default mongoose.model('Question', questionSchema); 