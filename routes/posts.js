const authenticateToken = require("../middlewares/auth");
const Comments = require("../models/comments");
const Like = require("../models/Likes");
const Post = require("../models/Posts");
const User = require("../models/users");

const router = require("express").Router();


// Create a new post
router.post('/posts',authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    try {
      const post = await Post.create({
        title,
        content,
        userId: req.user.userId,
      });
      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all posts
  router.get('/posts', authenticateToken, async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [{ model: User, attributes: ['name'] }],
      });
      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get a single post by ID
  router.get('/posts/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByPk(id, {
        include: [{ model: User, attributes: ['name'] }],
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update a post by ID
  router.put('/posts/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (req.user.role !== 'admin' && post.userId !== req.user.id) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to update this post' });
      }
      post.title = title;
      post.content = content;
      await post.save();
      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete a post by ID
  router.delete('/posts/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (req.user.role !== 'Admin' && post.userId !== req.user.userId) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to delete this post' });
      }
      await post.destroy();
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Create a new comment
router.post('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const comment = await Comment.create({
        content,
        postId: post.id,
        userId: req.user.id,
      });
      res.json({ comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all comments for a post
  router.get('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByPk(id, {
        include: [{ model: Comment, include: [{ model: User, attributes: ['name'] }] }],
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const comments = post.comments;
      res.json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Like a post
  router.post('/posts/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      await post.addUser(req.user);
      res.json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  

  module.exports = router;