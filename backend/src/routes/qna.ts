import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ctrl from '../controllers/qna.controller';

const router = Router();

// Public reads
router.get('/questions',              ctrl.listQuestions);
router.get('/questions/search',       ctrl.searchQuestions);
router.get('/questions/:id',          ctrl.getQuestion);
router.get('/tags',                   ctrl.listTags);

// Authenticated writes
router.post('/questions',                              authenticate, ctrl.askQuestion);
router.post('/questions/:id/answers',                  authenticate, ctrl.postAnswer);
router.post('/votes',                                  authenticate, ctrl.castVote);
router.post('/questions/:id/accept/:answerId',         authenticate, ctrl.acceptAnswer);

export default router;
