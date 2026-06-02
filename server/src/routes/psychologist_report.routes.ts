import { Router } from 'express';
import { PsychologistReportController } from '../controllers/psychologist_report.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.post('/', PsychologistReportController.create);
router.get('/', PsychologistReportController.getAll);
router.get('/:id', PsychologistReportController.getById);
router.put('/:id', PsychologistReportController.update);
router.delete('/:id', PsychologistReportController.delete);
router.post('/:id/send', PsychologistReportController.sendToPatient);

export default router;