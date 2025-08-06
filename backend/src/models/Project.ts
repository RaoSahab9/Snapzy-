import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
  size: number;
}

export interface IProjectMetadata {
  framework: string;
  backend: string;
  database: string;
  features: string[];
  estimatedTime: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  prompt: string;
  aiModel: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  files: IProjectFile[];
  metadata: IProjectMetadata;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectFileSchema = new Schema<IProjectFile>(
  {
    path: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['file', 'directory'],
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const projectMetadataSchema = new Schema<IProjectMetadata>(
  {
    framework: {
      type: String,
      required: true,
      default: 'react',
    },
    backend: {
      type: String,
      required: true,
      default: 'nodejs',
    },
    database: {
      type: String,
      required: true,
      default: 'mongodb',
    },
    features: [{
      type: String,
      required: true,
    }],
    estimatedTime: {
      type: String,
      required: true,
      default: '1-2 hours',
    },
    complexity: {
      type: String,
      enum: ['simple', 'medium', 'complex'],
      required: true,
      default: 'medium',
    },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    prompt: {
      type: String,
      required: [true, 'AI prompt is required'],
      trim: true,
    },
    aiModel: {
      type: String,
      required: [true, 'AI model is required'],
      enum: ['openai', 'claude', 'gemini', 'llama', 'mistral', 'ollama', 'lmstudio'],
    },
    status: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      required: true,
      default: 'pending',
    },
    files: [projectFileSchema],
    metadata: {
      type: projectMetadataSchema,
      required: true,
      default: () => ({}),
    },
    error: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ status: 1 });
projectSchema.index({ aiModel: 1 });
projectSchema.index({ 'metadata.framework': 1 });

// Virtual for project summary
projectSchema.virtual('summary').get(function () {
  return {
    id: this._id,
    title: this.title,
    status: this.status,
    framework: this.metadata.framework,
    backend: this.metadata.backend,
    database: this.metadata.database,
    createdAt: this.createdAt,
  };
});

// Method to get file count
projectSchema.methods.getFileCount = function (): number {
  return this.files.filter((file: IProjectFile) => file.type === 'file').length;
};

// Method to get total size
projectSchema.methods.getTotalSize = function (): number {
  return this.files.reduce((total: number, file: IProjectFile) => total + file.size, 0);
};

// Static method to find projects by user
projectSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find projects by status
projectSchema.statics.findByStatus = function (status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

export const Project = mongoose.model<IProject>('Project', projectSchema);