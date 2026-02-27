import { Router } from 'express';
import { EmotionController } from '../controllers/emotion.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/types', EmotionController.getEmotionTypes);

router.post('/entries', verifyToken, EmotionController.createEntry);
router.get('/entries/date/:date', verifyToken, EmotionController.getEntriesByDate);
router.get('/entries/range', verifyToken, EmotionController.getEntriesByDateRange);
router.delete('/entries/:id', verifyToken, EmotionController.deleteEntry);

export default router;