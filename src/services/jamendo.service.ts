import axios from 'axios';

const JAMENDO_CLIENT_ID = 'd6ae4611';
const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  duration: number;
  audio: string;
  audiodownload: string;
  image: string;
}

const TAG_MAP: { [key: string]: string } = {
  'Утренняя медитация': 'meditation',
  'Звуки природы': 'nature',
  'Для глубокого сна': 'sleep',
  'Снятие тревоги': 'relaxing',
};

// Статические треки — fallback
const STATIC_TRACKS: { [key: string]: JamendoTrack[] } = {
  'meditation': [
    { id: '1', name: 'Tibetan Meditation', artist_name: 'Relaxing Music', duration: 372, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', image: '' },
    { id: '2', name: 'Morning Calm', artist_name: 'Meditation Studio', duration: 311, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', image: '' },
    { id: '3', name: 'Inner Peace', artist_name: 'Sound Therapy', duration: 285, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', image: '' },
    { id: '4', name: 'Zen Garden', artist_name: 'Peaceful Mind', duration: 420, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', image: '' },
    { id: '5', name: 'Mindful Breathing', artist_name: 'Meditation Studio', duration: 360, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', image: '' },
    { id: '6', name: 'Silent Forest', artist_name: 'Nature & Mind', duration: 298, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', image: '' },
    { id: '7', name: 'Crystal Bowls', artist_name: 'Sound Therapy', duration: 445, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', image: '' },
    { id: '8', name: 'Chakra Balance', artist_name: 'Healing Sounds', duration: 390, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', image: '' },
    { id: '9', name: 'Morning Ritual', artist_name: 'Peaceful Mind', duration: 325, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', image: '' },
    { id: '10', name: 'Sacred Space', artist_name: 'Relaxing Music', duration: 412, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', image: '' },
  ],
  'nature': [
    { id: '11', name: 'Пение птиц в лесу', artist_name: 'Nature Sounds', duration: 342, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', image: '' },
    { id: '12', name: 'Морской прибой', artist_name: 'Nature Sounds', duration: 298, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', image: '' },
    { id: '13', name: 'Дождь в лесу', artist_name: 'Nature Sounds', duration: 415, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', image: '' },
    { id: '14', name: 'Горный ручей', artist_name: 'Nature Sounds', duration: 380, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', image: '' },
    { id: '15', name: 'Шум водопада', artist_name: 'Nature Sounds', duration: 360, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', image: '' },
    { id: '16', name: 'Летний луг', artist_name: 'Nature Sounds', duration: 420, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', image: '' },
    { id: '17', name: 'Ночной лес', artist_name: 'Nature Sounds', duration: 395, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', image: '' },
    { id: '18', name: 'Гроза вдали', artist_name: 'Nature Sounds', duration: 445, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', image: '' },
    { id: '19', name: 'Весенний ветер', artist_name: 'Nature Sounds', duration: 310, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', image: '' },
    { id: '20', name: 'Рассвет в горах', artist_name: 'Nature Sounds', duration: 480, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', image: '' },
  ],
  'sleep': [
    { id: '21', name: 'Deep Sleep', artist_name: 'Sleep Therapy', duration: 480, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', image: '' },
    { id: '22', name: 'Лунная колыбельная', artist_name: 'Sleep Therapy', duration: 362, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', image: '' },
    { id: '23', name: 'Ночная тишина', artist_name: 'Classical Sleep', duration: 390, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', image: '' },
    { id: '24', name: 'Delta Waves', artist_name: 'Binaural Beats', duration: 540, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', image: '' },
    { id: '25', name: 'Dreamscape', artist_name: 'Sleep Therapy', duration: 420, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', image: '' },
    { id: '26', name: 'Soft Rain on Leaves', artist_name: 'Nature Sleep', duration: 480, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', image: '' },
    { id: '27', name: 'Starry Night', artist_name: 'Classical Sleep', duration: 395, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', image: '' },
    { id: '28', name: 'Velvet Dreams', artist_name: 'Sleep Therapy', duration: 460, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', image: '' },
    { id: '29', name: 'Midnight Ocean', artist_name: 'Nature Sleep', duration: 510, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', image: '' },
    { id: '30', name: 'Theta Healing', artist_name: 'Binaural Beats', duration: 600, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', image: '' },
  ],
  'relaxing': [
    { id: '31', name: 'Снятие тревоги', artist_name: 'Calm Therapy', duration: 264, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', image: '' },
    { id: '32', name: 'Спокойствие', artist_name: 'Calm Therapy', duration: 318, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', image: '' },
    { id: '33', name: 'Гармония', artist_name: 'Calm Therapy', duration: 295, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', image: '' },
    { id: '34', name: 'Alpha Waves', artist_name: 'Binaural Beats', duration: 420, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', image: '' },
    { id: '35', name: 'Peaceful Valley', artist_name: 'Ambient Music', duration: 380, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', image: '' },
    { id: '36', name: 'Gentle Waves', artist_name: 'Calm Therapy', duration: 345, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', image: '' },
    { id: '37', name: 'Cloud Nine', artist_name: 'Ambient Music', duration: 410, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', image: '' },
    { id: '38', name: 'Serenity Now', artist_name: 'Calm Therapy', duration: 355, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', image: '' },
    { id: '39', name: 'Tranquil Mind', artist_name: 'Binaural Beats', duration: 480, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', image: '' },
    { id: '40', name: 'Soft Horizon', artist_name: 'Ambient Music', duration: 390, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', audiodownload: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', image: '' },
  ],
};

// Кэш для API результатов
const apiCache: { [key: string]: JamendoTrack[] } = {};

const fetchFromJamendo = async (tag: string, limit: number = 10): Promise<JamendoTrack[]> => {
  // Проверяем кэш
  if (apiCache[tag]) return apiCache[tag];

  const response = await axios.get(`${JAMENDO_BASE_URL}/tracks/`, {
    params: {
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit,
      tags: tag,
      audioformat: 'mp32',
      include: 'musicinfo',
      order: 'popularity_total',
    },
    timeout: 5000, 
  });

  const results = response.data.results || [];

  if (results.length > 0) {
    apiCache[tag] = results;
    return results;
  }

  return [];
};

export const getTracksByPlaylistTag = async (playlistName: string): Promise<JamendoTrack[]> => {
  const tag = TAG_MAP[playlistName] || 'meditation';

  try {
    // Пробуем API
    console.log(` Загружаем треки для "${playlistName}" (тег: ${tag}) из Jamendo API...`);
    const apiTracks = await fetchFromJamendo(tag, 10);

    if (apiTracks.length > 0) {
      console.log(` Загружено ${apiTracks.length} треков из API`);
      return apiTracks;
    }

    console.log(' API вернул пустой результат, используем статику');
    return STATIC_TRACKS[tag] || STATIC_TRACKS['meditation'];

  } catch (error) {
    console.log(` Jamendo API недоступен, используем статические треки`);
    return STATIC_TRACKS[tag] || STATIC_TRACKS['meditation'];
  }
};

export const searchTracks = async (tags: string, limit: number = 10): Promise<JamendoTrack[]> => {
  try {
    return await fetchFromJamendo(tags, limit);
  } catch {
    return STATIC_TRACKS[tags] || [];
  }
};