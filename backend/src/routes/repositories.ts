import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as ctrl from '../controllers/repositories.controller';

const router = Router();

// Public reads (visibility enforced inside controller)
router.get('/:username',             ctrl.getUserRepositories);
router.get('/:username/:slug',       ctrl.getRepository);

// Authenticated actions (repoId-based after lookup)
router.get('/:id/file',              authenticate, ctrl.getFileContent);
router.post('/',                     authenticate, ctrl.createRepository);
router.post('/:id/commits',          authenticate, ctrl.createCommit);
router.get('/:id/issues',            optionalAuth, ctrl.listIssues);   // private repos need auth
router.post('/:id/issues',           authenticate, ctrl.createIssue);
router.get('/:id/pulls',             optionalAuth, ctrl.listPullRequests);
router.post('/:id/pulls',            authenticate, ctrl.createPullRequest);
router.post('/:id/pulls/:prId/review', authenticate, ctrl.requestAIReview);
router.post('/:id/star',             authenticate, ctrl.toggleStar);

export default router;
