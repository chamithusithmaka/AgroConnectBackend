const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    // Remove: req.body.user = req.user.id;

    // Validate required fields from Flutter page
    const { heading, description, image, category, location } = req.body;

    if (!heading || !description || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide heading, description, and image'
      });
    }

    // Build post object
    const postData = {
      heading,
      description,
      image,
      // Add category and location if present
      ...(category && { category }),
      ...(location && { location }),
      // Remove: user: req.user.id,
    };

    // Create post
    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all posts (with filters for status)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Delete fields from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Default to only showing approved posts for regular users
    if (req.user && req.user.role === 'admin') {
      // Admin can see all posts or filter by status
      query = Post.find(reqQuery);
    } else {
      // Regular users can only see approved posts
      query = Post.find({ ...reqQuery, status: 'approved' });
    }

    // Select specific fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sort by creation date (newest first)
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate user info
    query = query.populate({
      path: 'user',
      select: 'fullName'
    });

    // Execute query
    const posts = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public (with restrictions)
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'user',
      select: 'fullName'
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Only return post if it's approved or if user is an admin or the post creator
    if (
      post.status === 'approved' ||
      (req.user && (req.user.role === 'admin' || post.user.id === req.user.id))
    ) {
      return res.status(200).json({
        success: true,
        data: post
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this post'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // If user is admin and only status is being updated
    if (req.user.role === 'admin' && Object.keys(req.body).length === 1 && req.body.status) {
      // Just update status
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
    } else {
      // Regular update (don't allow status change for non-admins)
      if (req.user.role !== 'admin') {
        delete req.body.status; // Remove status field if present
      }
      
      post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post has already been liked by this user
    const likedIndex = post.likes.findIndex(
      like => like.toString() === req.user.id
    );

    // If already liked, remove the like
    if (likedIndex > -1) {
      post.likes.splice(likedIndex, 1);
      await post.save();
      
      return res.status(200).json({
        success: true,
        message: 'Post unliked',
        likeCount: post.likes.length,
        liked: false
      });
    }

    // Add the like
    post.likes.unshift(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post liked',
      likeCount: post.likes.length,
      liked: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Create new comment
    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    // Add to comments array
    post.comments.unshift(newComment);

    await post.save();

    res.status(201).json({
      success: true,
      data: post.comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete comment from post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Find the comment
    const comment = post.comments.find(
      comment => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Get remove index
    const removeIndex = post.comments.findIndex(
      comment => comment.id === req.params.commentId
    );

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.status(200).json({
      success: true,
      data: post.comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update post status (admin only)
// @route   PUT /api/posts/:id/status
// @access  Admin
exports.updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (pending, approved, rejected)'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.status = status;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get post likes count
// @route   GET /api/posts/:id/likes
// @access  Public
exports.getPostLikesCount = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Only provide data if post is approved or user is admin/owner
    if (
      post.status === 'approved' ||
      (req.user && (req.user.role === 'admin' || post.user.toString() === req.user.id))
    ) {
      return res.status(200).json({
        success: true,
        likesCount: post.likes.length,
        // If user is logged in, check if they liked the post
        liked: req.user ? post.likes.some(like => like.toString() === req.user.id) : false
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this post'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get post comments
// @route   GET /api/posts/:id/comments
// @access  Public
exports.getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'comments.user',
      select: 'fullName'
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Only provide data if post is approved or user is admin/owner
    if (
      post.status === 'approved' ||
      (req.user && (req.user.role === 'admin' || post.user.toString() === req.user.id))
    ) {
      return res.status(200).json({
        success: true,
        count: post.comments.length,
        data: post.comments
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this post'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};