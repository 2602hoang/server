import express from 'express';
import { loginUser, registerUser, updateUser } from '../controller/authController.js';


const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update/:id_user' , updateUser);


export default router;