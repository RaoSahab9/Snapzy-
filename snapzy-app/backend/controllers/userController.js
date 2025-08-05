const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts count
    const postCount = await Post.countDocuments({ user: user._id });

    // Check if current user follows this user
    const isFollowing = req.user ? user.followers.some(
      follower => follower._id.toString() === req.user._id.toString()
    ) : false;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        postCount,
        isPrivate: user.isPrivate,
        isFollowing
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, isPrivate } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow/Unfollow user
const toggleFollow = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user._id;

    if (userToFollowId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userToFollowId
    });

    if (existingFollow) {
      // Unfollow
      await Follow.deleteOne({ _id: existingFollow._id });
      
      // Update user documents
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userToFollowId }
      });
      await User.findByIdAndUpdate(userToFollowId, {
        $pull: { followers: currentUserId }
      });

      res.json({ message: 'Unfollowed successfully', isFollowing: false });
    } else {
      // Follow
      const newFollow = new Follow({
        follower: currentUserId,
        following: userToFollowId
      });
      await newFollow.save();

      // Update user documents
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userToFollowId }
      });
      await User.findByIdAndUpdate(userToFollowId, {
        $addToSet: { followers: currentUserId }
      });

      res.json({ message: 'Followed successfully', isFollowing: true });
    }
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's followers
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username fullName profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's following
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username fullName profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username fullName profilePicture')
    .limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers
};