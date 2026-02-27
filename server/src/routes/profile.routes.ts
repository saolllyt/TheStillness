import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.get('/me', ProfileController.getProfile);
router.put('/me', ProfileController.updateProfile);
router.get('/emotions/week', ProfileController.getWeekEmotions);
router.get('/diary', ProfileController.getDiaryEntries);
router.post('/report', ProfileController.generateReport);

export default router;