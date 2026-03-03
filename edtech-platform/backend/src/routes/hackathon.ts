import { Router } from 'express';
import { HackathonController } from '@/controllers/hackathon';
import { hackathonValidators, commonValidators } from '@/utils/validators';
import { validate } from '@/middleware/validate';
import { authenticate, optionalAuth } from '@/middleware/auth';
import { apiLimiter } from '@/middleware/rateLimiter';

const router = Router();
const controller = new HackathonController();

router.get('/', apiLimiter, optionalAuth, controller.getHackathons.bind(controller));
router.get('/:id', apiLimiter, optionalAuth, commonValidators.idParam, validate, controller.getHackathonById.bind(controller));
router.get('/:id/leaderboard', apiLimiter, commonValidators.idParam, validate, controller.getLeaderboard.bind(controller));
router.post('/:id/register', apiLimiter, authenticate, commonValidators.idParam, validate, controller.register.bind(controller));
router.post('/:id/teams', apiLimiter, authenticate, commonValidators.idParam, validate, controller.createTeam.bind(controller));
router.post('/:id/teams/join', apiLimiter, authenticate, commonValidators.idParam, validate, controller.joinTeam.bind(controller));
router.post('/:id/submit', apiLimiter, authenticate, commonValidators.idParam, hackathonValidators.submitCode, validate, controller.submitCode.bind(controller));
router.post('/:id/run', apiLimiter, authenticate, commonValidators.idParam, validate, controller.runCode.bind(controller));
router.get('/:id/submissions', apiLimiter, authenticate, commonValidators.idParam, validate, controller.getUserSubmissions.bind(controller));
router.get('/:id/matches', apiLimiter, authenticate, commonValidators.idParam, validate, controller.getPotentialMatches.bind(controller));

export default router;
