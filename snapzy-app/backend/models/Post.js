const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    maxlength: 500,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: String,
    maxlength: 100,
    trim: true
  },
  hashtags: [{
    type: String,
    lowercase: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Extract hashtags from caption before saving
postSchema.pre('save', function(next) {
  if (this.isModified('caption') && this.caption) {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    
    while ((match = hashtagRegex.exec(this.caption)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }
    
    this.hashtags = [...new Set(hashtags)]; // Remove duplicates
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);