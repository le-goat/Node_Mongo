import express from 'express';

const userRouter = express.Router()

import {deleteUser, getUsers, getUser, createUser, updateUser} from '../controllers/user.js';
import {loginUser} from "../controllers/auth.js";
import {authMiddleware} from "../middleware/auth.js";

// Routes publiques
userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);

// Routes protégées
userRouter.get('/', authMiddleware, getUsers);
userRouter.get('/:id', authMiddleware, getUser);
userRouter.put('/:id', authMiddleware, updateUser);
userRouter.delete('/:id', authMiddleware, deleteUser);


export default userRouter;