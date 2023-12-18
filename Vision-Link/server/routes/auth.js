import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error('Error in /register route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
