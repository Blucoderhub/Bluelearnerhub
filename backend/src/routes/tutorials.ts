import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { checkCredits } from '../middleware/credits';
import * as ctrl from '../controllers/tutorials.controller';

const router = Router();

// Public browsing
router.get('/',           ctrl.listTutorials);
router.get('/search',     ctrl.searchTutorials);
router.get('/:slug',      ctrl.getTutorial);

// Authenticated actions
router.post('/',                  authenticate, ctrl.createTutorial);       // Teacher+
router.post('/:id/progress',      authenticate, ctrl.markSectionComplete);
router.post('/:id/run-code',      authenticate, checkCredits, ctrl.runCode);

export default router;
