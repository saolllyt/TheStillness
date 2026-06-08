// Jamendo API сервис на стороне сервера

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

interface PlaylistConfig {
  fuzzytags: string;
  acousticelectric?: 'acoustic' | 'electric';
  vocalinstrumental?: 'instrumental' | 'vocal';
  speed?: 'verylow' | 'low' | 'medium' | 'high' | 'veryhigh';
}

// Уникальные конфиги для каждого плейлиста — разные первичные теги
const PLAYLIST_CONFIG: { [key: string]: PlaylistConfig } = {
  'Утренняя медитация': {
    fuzzytags: 'meditation zen mindfulness morning tranquil',
    vocalinstrumental: 'instrumental',
    speed: 'low',
  },
  'Звуки природы': {
    fuzzytags: 'nature forest birds organic soundscape',
    acousticelectric: 'acoustic',
    vocalinstrumental: 'instrumental',
  },
  'Для глубокого сна': {
    fuzzytags: 'sleep dream lullaby night hypnotic',
    vocalinstrumental: 'instrumental',
    speed: 'verylow',
  },
  'Снятие тревоги': {
    fuzzytags: 'calm soothing anxiety healing therapeutic',
    vocalinstrumental: 'instrumental',
  },
  'Фортепиано и душа': {
    fuzzytags: 'piano neoclassical solo melancholy emotional',
    acousticelectric: 'acoustic',
    vocalinstrumental: 'instrumental',
  },
  'Йога и растяжка': {
    fuzzytags: 'yoga flow breathing stretch body',
    vocalinstrumental: 'instrumental',
    speed: 'low',
  },
  'Концентрация и фокус': {
    fuzzytags: 'focus study concentration work productivity',
    vocalinstrumental: 'instrumental',
  },
  'Дождь и гроза': {
    fuzzytags: 'rain thunder storm atmospheric dark',
    vocalinstrumental: 'instrumental',
  },
  'Классика для отдыха': {
    fuzzytags: 'classical orchestra symphony romantic chamber',
    vocalinstrumental: 'instrumental',
  },
  'Бинауральные ритмы': {
    fuzzytags: 'binaural theta alpha brainwave frequency',
    vocalinstrumental: 'instrumental',
  },
  'Джаз и блюз': {
    fuzzytags: 'jazz blues soul smooth lounge',
    speed: 'low',
  },
  'Гитара у костра': {
    fuzzytags: 'acoustic guitar folk campfire fingerpicking',
    acousticelectric: 'acoustic',
    vocalinstrumental: 'instrumental',
  },
  'Осень и ностальгия': {
    fuzzytags: 'melancholy nostalgic sad introspective autumn',
    vocalinstrumental: 'instrumental',
    speed: 'low',
  },
  'Звуки океана': {
    fuzzytags: 'ocean sea waves beach coastal ambient',
    vocalinstrumental: 'instrumental',
    speed: 'verylow',
  },
  'Энергия и подъём': {
    fuzzytags: 'uplifting positive happy energetic joyful',
    speed: 'medium',
  },
};

const apiCache: { [playlistName: string]: JamendoTrack[] } = {};

export const fetchJamendoTracks = async (
  playlistName: string,
  limit = 50,
): Promise<JamendoTrack[]> => {
  if (apiCache[playlistName]) {
    console.log(`🎵 Jamendo кэш: "${playlistName}"`);
    return apiCache[playlistName];
  }

  const config = PLAYLIST_CONFIG[playlistName];
  if (!config) {
    console.warn(` Нет конфига для плейлиста "${playlistName}"`);
    return [];
  }

  try {
    console.log(` Jamendo запрос для "${playlistName}": fuzzytags="${config.fuzzytags}"`);

    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: String(limit),
      fuzzytags: config.fuzzytags,
      audioformat: 'mp32',
      include: 'musicinfo',
      order: 'popularity_total',
      imagesize: '200',   
    });

    if (config.acousticelectric)    params.set('acousticelectric', config.acousticelectric);
    if (config.vocalinstrumental)   params.set('vocalinstrumental', config.vocalinstrumental);
    if (config.speed)               params.set('speed', config.speed);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); 

    const response = await fetch(
      `${JAMENDO_BASE_URL}/tracks/?${params.toString()}`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Jamendo HTTP ${response.status}`);
    }

    const data = (await response.json()) as { results?: JamendoTrack[] };
    const results = (data.results || []).filter((t) => t.audio);

    if (results.length > 0) {
      console.log(` Jamendo: ${results.length} треков для "${playlistName}"`);
      apiCache[playlistName] = results;
      return results;
    }

    console.log(` Jamendo: пустой результат для "${playlistName}"`);
    return [];
  } catch (error: any) {
    console.warn(` Jamendo API ошибка "${playlistName}": ${error?.message || error}`);
    return [];
  }
};

// Сбросить кэш 
export const clearJamendoCache = () => {
  Object.keys(apiCache).forEach((key) => delete apiCache[key]);
};
