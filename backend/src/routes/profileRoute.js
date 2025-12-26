import express from 'express';
import { getProfile,addProfile } from '../controller/profileController.js'
import { addProfileValidation } from '../validations/profileValidations.js';

const router=express.Router();

router.get('/profile',getProfile);
router.post('/profile',addProfileValidation,addProfile);

export default router;