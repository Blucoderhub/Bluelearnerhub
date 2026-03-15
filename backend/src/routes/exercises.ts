import { Router } from 'express';
import { listExercises, getExercise } from '@/controllers/exercises.controller';

const router = Router();

router.get('/',    listExercises);
router.get('/:id', getExercise);

export default router;
