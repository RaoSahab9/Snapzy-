const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  limits: {
    dailyGenerations: {
      type: Number,
      default: 3
    },
    usedToday: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    defaultAIModel: {
      type: String,
      default: 'openai-gpt4'
    },
    defaultTechStack: {
      frontend: {
        type: String,
        default: 'react'
      },
      backend: {
        type: String,
        default: 'nodejs'
      },
      database: {
        type: String,
        default: 'mongodb'
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Reset daily usage if needed
userSchema.methods.resetDailyUsageIfNeeded = function() {
  const today = new Date();
  const lastReset = new Date(this.limits.lastResetDate);
  
  if (today.toDateString() !== lastReset.toDateString()) {
    this.limits.usedToday = 0;
    this.limits.lastResetDate = today;
  }
};

module.exports = mongoose.model('User', userSchema);