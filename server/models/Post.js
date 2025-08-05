const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  username: {
    type: String,
    required: true
  },
  userProfilePicture: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [1000, 'Caption cannot exceed 1000 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Index for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ likes: 1 });
postSchema.index({ tags: 1 });

// Method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Method to add like
postSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(userId, text, username, userProfilePicture) {
  this.comments.push({
    user: userId,
    text,
    username,
    userProfilePicture
  });
  return this.save();
};

// Method to remove comment
postSchema.methods.removeComment = function(commentId) {
  this.comments = this.comments.filter(comment => comment._id.toString() !== commentId);
  return this.save();
};

// Method to get public post data
postSchema.methods.getPublicPost = function() {
  const postObject = this.toObject();
  delete postObject.__v;
  return postObject;
};

module.exports = mongoose.model('Post', postSchema);