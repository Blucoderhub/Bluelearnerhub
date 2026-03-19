import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { checkCredits } from '../middleware/credits';

const router = Router();

router.post('/chat', authenticate, checkCredits, aiController.chat);
router.get('/quiz', authenticate, checkCredits, aiController.getDailyQuiz);
router.post('/quiz/submit', authenticate, aiController.submitQuiz);
router.post('/review', authenticate, checkCredits, aiController.reviewProject);
router.get('/recommend', authenticate, checkCredits, aiController.getRecommendations);
router.post('/hackathon-help', authenticate, checkCredits, aiController.getHackathonHelp);

export default router;
