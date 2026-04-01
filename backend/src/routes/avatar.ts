import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { UserModel } from '../models/user';
import { AppError } from '../middleware/error';

const router = Router();

// GET /api/avatar/:userId - Return avatar config
router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId as string);
    if (isNaN(userId)) {
      throw new AppError('Invalid User ID', 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user.avatar_config || { seed: user.email.split('@')[0], style: 'adventurer' }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/avatar/save - Save/Update avatar configuration
router.post('/save', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { config } = req.body;

    if (!config) {
      throw new AppError('Avatar configuration is required', 400);
    }

    const user = await UserModel.update(userId, { avatarConfig: config });

    res.json({
      success: true,
      message: 'Avatar configuration saved successfully',
      data: user?.avatar_config
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/avatar/update - Alias for save
router.put('/update', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { config } = req.body;

    if (!config) {
      throw new AppError('Avatar configuration is required', 400);
    }

    const user = await UserModel.update(userId, { avatarConfig: config });

    res.json({
      success: true,
      message: 'Avatar configuration updated successfully',
      data: user?.avatar_config
    });
  } catch (error) {
    next(error);
  }
});

export default router;
