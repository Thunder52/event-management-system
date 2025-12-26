import { body } from 'express-validator';

export const addProfileValidation = [
  body('name')
    .exists().withMessage('Name is required')
    .bail()
    .notEmpty().withMessage('Name cannot be empty')
    .bail()
    .trim()
];