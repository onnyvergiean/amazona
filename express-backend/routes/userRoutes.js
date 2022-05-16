import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import { generateToken } from '../util.js';

const useRouter = express.Router();

useRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  })
);

export default useRouter;
