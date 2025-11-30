import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'kicked'],
    default: 'active'
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  profileProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // No hashing, save password as plain text
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Direct comparison (plain text)
  return candidatePassword === this.password;
};

export default mongoose.model('User', userSchema);
