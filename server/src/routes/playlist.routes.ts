import { Router } from 'express';
import { PlaylistController } from '../controllers/playlist.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Публичные маршруты без авторизации
router.get('/', PlaylistController.getAllPlaylists);
router.get('/:id', PlaylistController.getPlaylistById);
router.get('/:id/tracks', PlaylistController.getTracksByPlaylist);
router.get('/:id/jamendo', PlaylistController.getJamendoTracks);

// Защищённые маршруты с авторизацией
router.get('/downloads/my', verifyToken, PlaylistController.getMyDownloads);
router.get('/favorites/my', verifyToken, PlaylistController.getMyFavorites);
router.post('/download', verifyToken, PlaylistController.saveDownloadedTrack);
router.post('/favorite', verifyToken, PlaylistController.addToFavorites);
router.post('/favorite/jamendo', verifyToken, PlaylistController.addJamendoFavorite);
router.delete('/favorite/:trackId', verifyToken, PlaylistController.removeFromFavorites);

export default router;