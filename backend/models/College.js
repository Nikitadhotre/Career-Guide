import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '4 years'
  },
  fees: {
    type: Number,
    default: 0
  },
  seats: {
    type: Number,
    default: 0
  }
});

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  courses: [courseSchema],
  streams: [{
    type: String,
    enum: ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science', 'Law', 'Management', 'Design', 'IT', 'Agriculture']
  }],
  interestTags: [{
    type: String,
    required: true
  }],
  rank: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  facilities: [{
    type: String
  }],
  admissionCriteria: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
collegeSchema.index({ 'location.state': 1, 'location.city': 1 });
collegeSchema.index({ streams: 1 });
collegeSchema.index({ interestTags: 1 });
collegeSchema.index({ rank: 1 });
collegeSchema.index({ rating: -1 });

// Virtual for full address
collegeSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state}`;
});

// Ensure virtual fields are serialized
collegeSchema.set('toJSON', { virtuals: true });
collegeSchema.set('toObject', { virtuals: true });

export default mongoose.model('College', collegeSchema); 