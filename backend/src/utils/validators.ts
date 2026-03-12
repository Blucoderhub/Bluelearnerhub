import { body, param, query } from 'express-validator';

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const authValidators = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(PASSWORD_COMPLEXITY_REGEX)
      .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('role').isIn(['student', 'corporate', 'college']).withMessage('Invalid role'),
  ],

  login: [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(PASSWORD_COMPLEXITY_REGEX)
      .withMessage('New password must contain uppercase, lowercase, number and special character'),
  ],
};

export const quizValidators = {
  createQuiz: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('quizType').isIn(['daily', 'practice', 'assessment', 'ai_generated']),
    body('domain').notEmpty().withMessage('Domain is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard', 'expert']),
    body('totalQuestions').isInt({ min: 1 }).withMessage('Must have at least 1 question'),
  ],

  submitAnswer: [
    body('questionId').isInt().withMessage('Valid question ID required'),
    body('answer').notEmpty().withMessage('Answer is required'),
  ],
};

export const hackathonValidators = {
  createHackathon: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('startTime').isISO8601().withMessage('Valid start time required'),
    body('endTime').isISO8601().withMessage('Valid end time required'),
    body('problemStatement').trim().notEmpty().withMessage('Problem statement required'),
  ],

  submitCode: [
    body('language').notEmpty().withMessage('Programming language is required'),
    body('sourceCode').notEmpty().withMessage('Source code is required'),
  ],

  behaviorEvent: [
    body('eventType').isString().trim().isLength({ min: 1, max: 100 }).withMessage('eventType is required'),
    body('eventPayload').optional().isObject({ strict: true }).withMessage('eventPayload must be a plain object'),
  ],
};

export const jobValidators = {
  createJob: [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('jobType').isIn(['full_time', 'part_time', 'contract', 'internship']),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],

  apply: [
    body('resumeUrl').isURL().withMessage('Valid resume URL required'),
  ],
};

export const commonValidators = {
  idParam: [
    param('id').isInt({ min: 1 }).withMessage('Valid ID required'),
  ],

  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  ],
};
