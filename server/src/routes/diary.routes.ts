import { Router } from 'express';
import { DiaryController } from '../controllers/diary.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.get('/', DiaryController.getEntries);
router.get('/:id', DiaryController.getEntry);
router.post('/', DiaryController.createEntry);
router.put('/:id', DiaryController.updateEntry);
router.delete('/:id', DiaryController.deleteEntry);

export default router;