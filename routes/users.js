const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();



const JWT_SECRET = process.env.JWT_SECRET;



router.post('/register', async (req, res) => {
    const { name,email,password,role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ name, email, password: hash, role });
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '55m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET + user.password,
        { expiresIn: '7d' }
      );
      res.json({ accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is missing' });
    }
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const isRefreshTokenValid = jwt.verify(
        refreshToken,
        JWT_SECRET + user.password
      );
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  });
  

module.exports = router;