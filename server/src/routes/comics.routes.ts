import { Router } from 'express';
import { ComicsController } from '../controllers/comics.controller';

const router = Router();

router.get('/list', ComicsController.getAllComics);
router.get('/:id', ComicsController.getComicById);
router.get('/:id/pages', ComicsController.getComicPages);

export default router;