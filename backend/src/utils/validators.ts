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
    body('role').isIn(['STUDENT', 'CORPORATE', 'CANDIDATE', 'FACULTY', 'INSTITUTION', 'HR', 'ADMIN']).withMessage('Invalid role'),
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
    body('startDate').notEmpty().withMessage('Start date is required'),
    body('endDate').notEmpty().withMessage('End date is required'),
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

export const profileValidators = {
  update: [
    body('fullName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Full name must be 1-100 characters'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be at most 500 characters'),
    body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must be at most 100 characters'),
    body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
    body('linkedinUrl').optional().isURL().withMessage('LinkedIn URL must be valid'),
    body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
    body('portfolioUrl').optional().isURL().withMessage('Portfolio URL must be valid'),
    body('graduationYear').optional().isInt({ min: 1950, max: 2100 }).withMessage('Invalid graduation year'),
    body('yearsExperience').optional().isInt({ min: 0, max: 60 }).withMessage('Invalid years of experience'),
    body('currentPosition').optional().trim().isLength({ max: 150 }).withMessage('Position must be at most 150 characters'),
    body('company').optional().trim().isLength({ max: 150 }).withMessage('Company must be at most 150 characters'),
    body('collegeName').optional().trim().isLength({ max: 150 }).withMessage('College name must be at most 150 characters'),
    // Reject any attempt to set privileged fields
    body('role').not().exists().withMessage('role cannot be updated via profile'),
    body('email').not().exists().withMessage('email cannot be updated via profile'),
    body('password').not().exists().withMessage('password cannot be updated via profile'),
    body('isActive').not().exists().withMessage('isActive cannot be updated via profile'),
    body('failedLoginAttempts').not().exists().withMessage('failedLoginAttempts cannot be updated via profile'),
    body('lockedUntil').not().exists().withMessage('lockedUntil cannot be updated via profile'),
  ],
};

export const aiValidators = {
  chat: [
    body('message').isString().trim().notEmpty().withMessage('Message is required'),
    body('persona').optional().isIn(['tutor', 'mentor', 'reviewer', 'interviewer']).withMessage('Invalid persona'),
  ],

  review: [
    body('projectContent').isString().trim().notEmpty().withMessage('Project content is required'),
    body('domain').isString().trim().notEmpty().withMessage('Domain is required'),
    body('persona').optional().isIn(['technical', 'product', 'business']).withMessage('Invalid persona'),
  ],

  hackathonHelp: [
    body('hackathonTheme').isString().trim().notEmpty().withMessage('Hackathon theme is required'),
    body('query').isString().trim().notEmpty().withMessage('Query is required'),
  ],

  checkout: [
    body('tier').isString().trim().isIn(['EXPLORER', 'INNOVATOR', 'ENTERPRISE']).withMessage('Invalid subscription tier'),
  ],
};
