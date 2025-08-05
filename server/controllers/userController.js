const User = require('../models/User');
const Post = require('../models/Post');
const { uploadProfilePicture } = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture fullName')
      .populate('following', 'username profilePicture fullName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user: user.getPublicProfile(),
      posts
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, username } = req.body;
    const { profilePicture } = req.body;

    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { fullName, bio, username };

    // Handle profile picture upload
    if (profilePicture && profilePicture.startsWith('data:image')) {
      try {
        const result = await uploadProfilePicture(profilePicture);
        updateData.profilePicture = result.url;
      } catch (error) {
        return res.status(400).json({ message: 'Profile picture upload failed' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('followers', 'username profilePicture')
     .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Follow user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following
    currentUser.following.push(req.params.id);
    await currentUser.save();

    // Add to followers
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/:id/follow
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username fullName profilePicture bio')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Get users that the current user is not following
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, req.user._id] 
      }
    })
    .select('username fullName profilePicture bio')
    .limit(5);

    res.json(suggestedUsers);
  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers
};