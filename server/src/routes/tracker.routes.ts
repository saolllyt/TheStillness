import { Router } from 'express';
import { TrackerController } from '../controllers/tracker.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.get('/today', TrackerController.getTodayEntries);
router.post('/entries', TrackerController.createEntry);
router.put('/entries/:id', TrackerController.updateEntry);
router.delete('/entries/:id', TrackerController.deleteEntry);
router.get('/types', TrackerController.getEmotionTypes);

export default router;