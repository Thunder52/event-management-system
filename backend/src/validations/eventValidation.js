import { body, param } from 'express-validator';

export const createEventValidation = [
  body('profiles')
    .isArray({ min: 1 })
    .withMessage('At least one profile is required'),

  body('timezone')
    .notEmpty()
    .withMessage('Timezone is required'),

  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
];

export const editEventValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event id'),

  body('timezone')
    .optional()
    .notEmpty()
    .withMessage('Timezone cannot be empty'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be valid'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be valid'),
];