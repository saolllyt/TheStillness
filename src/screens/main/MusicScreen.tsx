import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  PanResponder,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import api from '../../services/api/client';

interface Playlist {
  id: number;
  title: string;
  description: string | null;
  cover_image_url?: string | null;
}

interface Track {
  id: number;
  title: string;
  artist: string | null;
  audio_url: string;
  duration_seconds: number | null;
  image_url?: string;
  jamendo_id?: string;   // Реальный ID трека в джамендо
  playlist_id?: number;  // ID плейлиста в БД для сохранения в избранное
  playlist_name?: string;
}

const PLAYLIST_COLORS: { [key: string]: string } = {
  'Утренняя медитация': '#F0CF85',
  'Звуки природы':      '#4A7A6C',
  'Для глубокого сна':  '#89B6C9',
  'Снятие тревоги':     '#A7C4B5',
  'Фортепиано и душа':  '#C8A2C8',
  'Йога и растяжка':    '#9EC4C8',
  'Концентрация и фокус': '#7BA7BC',
  'Дождь и гроза':      '#697C8F',
  'Классика для отдыха': '#D4A5A5',
  'Бинауральные ритмы': '#8E9FC5',
  'Избранное':          '#E8A87C',
};

const PLAYLIST_ICONS: { [key: string]: string } = {
  'Утренняя медитация': '🌅',
  'Звуки природы':      '🌿',
  'Для глубокого сна':  '🌙',
  'Снятие тревоги':     '🫧',
  'Фортепиано и душа':  '🎹',
  'Йога и растяжка':    '🧘',
  'Концентрация и фокус': '🎯',
  'Дождь и гроза':      '🌧️',
  'Классика для отдыха': '🎻',
  'Бинауральные ритмы': '🧠',
  'Избранное':          '❤️',
};

type TabType = 'playlists' | 'favorites';

export const MusicScreen = () => {
  const insets = useSafeAreaInsets();
  const NAV_BOTTOM = 62 + 28 + insets.bottom;

  const [activeTab, setActiveTab] = useState<TabType>('playlists');
  const activeTabRef = useRef<TabType>('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteJamendoIds, setFavoriteJamendoIds] = useState<Set<string>>(new Set());
  const [togglingFav, setTogglingFav] = useState<number | null>(null);

  const [favTracks, setFavTracks] = useState<Track[]>([]);
  const [favCurrentIndex, setFavCurrentIndex] = useState(0);
  const [playingFromFavorites, setPlayingFromFavorites] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarWidthRef = useRef(300);

  const tracksRef = useRef<Track[]>([]);
  const favTracksRef = useRef<Track[]>([]);
  const currentIdxRef = useRef(0);
  const favIdxRef = useRef(0);
  const playingFromFavsRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { favTracksRef.current = favTracks; }, [favTracks]);
  useEffect(() => { currentIdxRef.current = currentTrackIndex; }, [currentTrackIndex]);
  useEffect(() => { favIdxRef.current = favCurrentIndex; }, [favCurrentIndex]);
  useEffect(() => { playingFromFavsRef.current = playingFromFavorites; }, [playingFromFavorites]);

  // Свайп между вкладками 
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 20 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -60 && activeTabRef.current === 'playlists') setActiveTab('favorites');
        else if (gs.dx > 60 && activeTabRef.current === 'favorites') setActiveTab('playlists');
      },
    })
  ).current;

  useEffect(() => {
    isMountedRef.current = true;
    loadPlaylists();
    loadFavorites();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    return () => {
      isMountedRef.current = false;
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  useFocusEffect(useCallback(() => {
    loadFavorites();
  }, []));

  const loadFavorites = async () => {
    try {
      const response = await api.get('/playlists/favorites/my');
      const data: any[] = response.data.data || [];
      if (isMountedRef.current) {
        setFavorites(data);
        const jamendoSet = new Set(
          data
            .filter(t => t.source === 'jamendo' && t.external_id)
            .map(t => String(t.external_id).replace('jamendo_', ''))
        );
        setFavoriteJamendoIds(jamendoSet);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Загружаем и воспроизводим трек
  const loadAndPlayTrack = useCallback(async (track: Track, retryCount = 0): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      if (isMountedRef.current) {
        setIsLoadingAudio(true);
        setPosition(0);
        setDuration(0);
      }

      // Останавливаем предыдущий звук
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio_url },
        { shouldPlay: true },
        (status: any) => {
          if (!status.isLoaded || !isMountedRef.current) return;
          setIsPlaying(status.isPlaying ?? false);
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);

          // Автоматический переход к следующему треку
          if (status.didJustFinish) {
            const fromFavs = playingFromFavsRef.current;
            const list = fromFavs ? favTracksRef.current : tracksRef.current;
            const idx  = fromFavs ? favIdxRef.current    : currentIdxRef.current;

            if (idx < list.length - 1 && isMountedRef.current) {
              const nextIdx   = idx + 1;
              const nextTrack = list[nextIdx];
              if (fromFavs) {
                favIdxRef.current = nextIdx;
                setFavCurrentIndex(nextIdx);
              } else {
                currentIdxRef.current = nextIdx;
                setCurrentTrackIndex(nextIdx);
              }
              setTimeout(() => loadAndPlayTrack(nextTrack), 400);
            } else {
              if (isMountedRef.current) setIsPlaying(false);
            }
          }
        }
      );

      soundRef.current = sound;
      if (isMountedRef.current) {
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }
    } catch (error) {
      if (retryCount < 1) {
        await new Promise(r => setTimeout(r, 1500));
        return loadAndPlayTrack(track, retryCount + 1);
      }
      console.warn('Track load failed after retry:', (error as Error)?.message ?? error);
      if (isMountedRef.current) {
        setIsLoadingAudio(false);
        setIsPlaying(false);
        Alert.alert('Не удалось загрузить трек', 'Проверьте соединение с интернетом и попробуйте другой трек.');
      }
    }
  }, []);

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handlePrev = async () => {
    const fromFavs = playingFromFavorites;
    const list  = fromFavs ? favTracks : tracks;
    const idx   = fromFavs ? favCurrentIndex : currentTrackIndex;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    if (fromFavs) { setFavCurrentIndex(newIdx); favIdxRef.current = newIdx; }
    else          { setCurrentTrackIndex(newIdx); currentIdxRef.current = newIdx; }
    await loadAndPlayTrack(list[newIdx]);
  };

  const handleNext = async () => {
    const fromFavs = playingFromFavorites;
    const list  = fromFavs ? favTracks : tracks;
    const idx   = fromFavs ? favCurrentIndex : currentTrackIndex;
    if (idx >= list.length - 1) return;
    const newIdx = idx + 1;
    if (fromFavs) { setFavCurrentIndex(newIdx); favIdxRef.current = newIdx; }
    else          { setCurrentTrackIndex(newIdx); currentIdxRef.current = newIdx; }
    await loadAndPlayTrack(list[newIdx]);
  };

  const seekByLocation = async (locationX: number) => {
    if (!soundRef.current || duration === 0) return;
    const ratio  = Math.max(0, Math.min(1, locationX / progressBarWidthRef.current));
    const newPos = Math.floor(ratio * duration);
    setPosition(newPos);
    await soundRef.current.setPositionAsync(newPos);
  };

  const formatTime = (millis: number) => {
    const s = Math.floor(millis / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/playlists');
      if (isMountedRef.current) setPlaylists(response.data.data);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const loadPlaylistTracks = async (playlist: Playlist) => {
    try {
      setLoadingTracks(true);
      setSelectedPlaylist(playlist);

      // Сбрасываем воспроизведение
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      setTracks([]);           tracksRef.current = [];
      setCurrentTrackIndex(0); currentIdxRef.current = 0;
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setPlayingFromFavorites(false);
      playingFromFavsRef.current = false;

      let jamendoTracks: {
        id: string;
        name: string;
        artist_name: string;
        audio: string;
        duration: number;
        image: string;
      }[] = [];

      try {
        const resp = await api.get(`/playlists/${playlist.id}/jamendo`, { timeout: 20000 });
        jamendoTracks = resp.data.data || [];
        console.log(` Jamendo треков: ${jamendoTracks.length}`);
      } catch (e) {
        console.warn(' Jamendo недоступен');
      }

      const mapped: Track[] = jamendoTracks.map((t, i) => ({
        id: i + 1,
        title: t.name,
        artist: t.artist_name,
        audio_url: t.audio,
        duration_seconds: t.duration,
        image_url: t.image || undefined,
        jamendo_id: String(t.id),
        playlist_id: playlist.id,
        playlist_name: playlist.title,
      }));

      if (mapped.length === 0) {
        Alert.alert('Нет треков', 'Не удалось загрузить музыку. Проверьте соединение.');
      }

      setTracks(mapped);
      tracksRef.current = mapped;
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить треки');
    } finally {
      if (isMountedRef.current) setLoadingTracks(false);
    }
  };

  const handleBack = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setIsPlaying(false);
    setSelectedPlaylist(null);
    setTracks([]);        tracksRef.current = [];
    setCurrentTrackIndex(0); currentIdxRef.current = 0;
    setPosition(0);
    setDuration(0);
  };

  // Нажатие на трек в списке плейлиста
  const handleTrackPress = async (track: Track, index: number) => {
    const alreadySelected = index === currentTrackIndex && !playingFromFavorites && !!soundRef.current;
    if (alreadySelected) {
      togglePlayPause();
    } else {
      setCurrentTrackIndex(index);
      currentIdxRef.current = index;
      setPlayingFromFavorites(false);
      playingFromFavsRef.current = false;
      await loadAndPlayTrack(track);
    }
  };

  const toggleFavorite = async (track: Track) => {
    if (!track.jamendo_id) return;
    const jid = track.jamendo_id;
    const isAlreadyFav = favoriteJamendoIds.has(jid);

    try {
      setTogglingFav(track.id);

      if (isAlreadyFav) {
        const favTrack = favorites.find(f => f.external_id === `jamendo_${jid}`);
        if (favTrack) {
          await api.delete(`/playlists/favorite/${favTrack.id}`);
          setFavorites(prev => prev.filter(f => f.id !== favTrack.id));
        }
        setFavoriteJamendoIds(prev => { const s = new Set(prev); s.delete(jid); return s; });
      } else {
        await api.post('/playlists/favorite/jamendo', {
          jamendoId: jid,
          title: track.title,
          artist: track.artist,
          durationSeconds: track.duration_seconds,
          audioUrl: track.audio_url,
          playlistId: track.playlist_id,
        });
        setFavoriteJamendoIds(prev => new Set([...prev, jid]));
        await loadFavorites();
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    } finally {
      setTogglingFav(null);
    }
  };

  const playFromFavorites = async (favTrack: any) => {
    const index = favorites.findIndex(t => t.id === favTrack.id);
    const mapped: Track[] = favorites.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      audio_url: t.audio_url,
      duration_seconds: t.duration_seconds,
      image_url: playlists.find(p => p.id === t.playlist_id)?.cover_image_url || undefined,
      jamendo_id: t.external_id ? String(t.external_id).replace('jamendo_', '') : undefined,
      playlist_name: 'Избранное',
    }));
    const idx = index >= 0 ? index : 0;
    setPlayingFromFavorites(true); playingFromFavsRef.current = true;
    setFavTracks(mapped);          favTracksRef.current = mapped;
    setFavCurrentIndex(idx);       favIdxRef.current = idx;
    await loadAndPlayTrack(mapped[idx]);
  };

  const removeFromFavorites = async (trackId: number) => {
    try {
      const favTrack = favorites.find(f => f.id === trackId);
      await api.delete(`/playlists/favorite/${trackId}`);
      setFavorites(prev => prev.filter(f => f.id !== trackId));
      if (favTrack?.source === 'jamendo' && favTrack?.external_id) {
        const jid = String(favTrack.external_id).replace('jamendo_', '');
        setFavoriteJamendoIds(prev => { const s = new Set(prev); s.delete(jid); return s; });
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить из избранного');
    }
  };

  // Текущий воспроизводимый трек
  const activeTracks      = playingFromFavorites ? favTracks : tracks;
  const activeIndex       = playingFromFavorites ? favCurrentIndex : currentTrackIndex;
  const activePlaylistName = playingFromFavorites ? 'Избранное' : (selectedPlaylist?.title || '');
  const currentTrack      = activeTracks[activeIndex];
  const showBottomPlayer  = (selectedPlaylist !== null || playingFromFavorites) && !!currentTrack;


  const CoverPlaceholder = ({ name, size = 48 }: { name: string; size?: number }) => {
    const color = PLAYLIST_COLORS[name] || COLORS.secondary;
    const icon  = PLAYLIST_ICONS[name]  || '🎵';
    return (
      <View style={[styles.coverPlaceholder, { width: size, height: size, backgroundColor: color, borderRadius: size * 0.2 }]}>
        <Text style={{ fontSize: size * 0.42 }}>{icon}</Text>
      </View>
    );
  };

  const TrackCover = ({ track, playlistName, size = 48 }: { track: Track; playlistName: string; size?: number }) => {
    if (track.image_url) {
      return (
        <Image
          source={{ uri: track.image_url }}
          style={{ width: size, height: size, borderRadius: size * 0.2 }}
        />
      );
    }
    return <CoverPlaceholder name={playlistName} size={size} />;
  };

  const PlaylistCover = ({ playlist, size = 64 }: { playlist: Playlist; size?: number }) => {
    if (playlist.cover_image_url) {
      return (
        <Image
          source={{ uri: playlist.cover_image_url }}
          style={{ width: size, height: size, borderRadius: size * 0.2 }}
        />
      );
    }
    return <CoverPlaceholder name={playlist.title} size={size} />;
  };

  // Нижний плеер 

  const BottomPlayer = () => {
    if (!showBottomPlayer || !currentTrack) return null;
    const canPrev = activeIndex > 0;
    const canNext = activeIndex < activeTracks.length - 1;
    const isFav   = currentTrack.jamendo_id ? favoriteJamendoIds.has(currentTrack.jamendo_id) : false;

    return (
      <View style={[styles.bottomPlayer, { paddingBottom: NAV_BOTTOM }]}>
        {/* Строка с обложкой, инфа, кнопка избранного */}
        <View style={styles.playerInfoRow}>
          <TrackCover track={currentTrack} playlistName={activePlaylistName} size={54} />

          <View style={styles.playerTrackMeta}>
            <Text style={styles.playerTrackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.playerTrackArtist} numberOfLines={1}>
              {currentTrack.artist || 'Неизвестный исполнитель'}
            </Text>
            <Text style={styles.playerPlaylistLabel} numberOfLines={1}>
              {activePlaylistName}  •  {activeIndex + 1} / {activeTracks.length}
            </Text>
          </View>

          {currentTrack.jamendo_id && (
            <TouchableOpacity
              style={styles.playerFavBtn}
              onPress={() => toggleFavorite(currentTrack)}
              disabled={togglingFav === currentTrack.id}
            >
              {togglingFav === currentTrack.id
                ? <ActivityIndicator size="small" color={COLORS.error} />
                : <Feather name="heart" size={22} color={isFav ? COLORS.error : COLORS.textMuted} />
              }
            </TouchableOpacity>
          )}
        </View>

        {/* Прогресс */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.progressTouchArea}
          onLayout={(e) => { progressBarWidthRef.current = e.nativeEvent.layout.width; }}
          onPress={(e) => seekByLocation(e.nativeEvent.locationX)}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <View style={[styles.progressThumb, { left: `${Math.min(97, progress)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Таймеры и кнопки управления */}
        <View style={styles.playerControls}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={!canPrev}
              style={[styles.controlBtn, !canPrev && { opacity: 0.3 }]}
            >
              <Feather name="skip-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause} disabled={isLoadingAudio}>
              {isLoadingAudio
                ? <ActivityIndicator size="small" color={COLORS.white} />
                : <Feather name={isPlaying ? 'pause' : 'play'} size={28} color={COLORS.white} />
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!canNext}
              style={[styles.controlBtn, !canNext && { opacity: 0.3 }]}
            >
              <Feather name="skip-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.timeText, { textAlign: 'right' }]}>{formatTime(duration)}</Text>
        </View>
      </View>
    );
  };

  // Экран плейлиста 

  if (selectedPlaylist) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.white }}>
          <View style={styles.playerHeader}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.playerTitle} numberOfLines={1}>
              {selectedPlaylist.title}
            </Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        {loadingTracks ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Загрузка треков...</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={tracks}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item, index }) => {
                const isActive = index === currentTrackIndex && !playingFromFavorites && !!soundRef.current;
                const isFav    = item.jamendo_id ? favoriteJamendoIds.has(item.jamendo_id) : false;
                return (
                  <TouchableOpacity
                    style={[styles.trackItem, isActive && styles.trackItemActive]}
                    onPress={() => handleTrackPress(item, index)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.trackCoverWrap, { marginRight: SPACING.md }]}>
                      <TrackCover track={item} playlistName={selectedPlaylist.title} size={52} />
                      {isActive && (
                        <View style={styles.trackCoverOverlay}>
                          {isLoadingAudio
                            ? <ActivityIndicator size="small" color={COLORS.white} />
                            : <Feather name={isPlaying ? 'pause' : 'play'} size={18} color={COLORS.white} />
                          }
                        </View>
                      )}
                    </View>
                    <View style={styles.trackInfo}>
                      <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.trackArtist} numberOfLines={1}>
                        {item.artist || 'Неизвестный исполнитель'}
                      </Text>
                      {item.duration_seconds != null && (
                        <Text style={styles.trackDuration}>
                          {formatTime(item.duration_seconds * 1000)}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(item)}
                      disabled={togglingFav === item.id}
                    >
                      {togglingFav === item.id
                        ? <ActivityIndicator size="small" color={COLORS.primary} />
                        : <Feather name="heart" size={20} color={isFav ? COLORS.error : COLORS.textMuted} />
                      }
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: SPACING.lg,
                paddingTop: SPACING.md,
                paddingBottom: showBottomPlayer ? NAV_BOTTOM + 200 : NAV_BOTTOM + SPACING.xl,
              }}
              showsVerticalScrollIndicator={false}
            />
            <BottomPlayer />
          </>
        )}
      </View>
    );
  }

  //  Главный экран (список плейлистов и избранное)

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.white }}>
        <View style={styles.tabsContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'playlists' && styles.tabActive]}
              onPress={() => setActiveTab('playlists')}
            >
              <Text style={[styles.tabText, activeTab === 'playlists' && styles.tabTextActive]}>
                Плейлисты
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
                Избранное{favorites.length > 0 ? ` (${favorites.length})` : ''}
              </Text>
            </TouchableOpacity>
            <View style={[styles.tabIndicator, { left: activeTab === 'playlists' ? 0 : '50%' }]} />
          </View>
        </View>
      </SafeAreaView>

      {activeTab === 'playlists' ? (
        loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.playlistCard}
                onPress={() => loadPlaylistTracks(item)}
                activeOpacity={0.7}
              >
                <PlaylistCover playlist={item} size={64} />
                <View style={[styles.playlistInfo, { marginLeft: SPACING.md }]}>
                  <Text style={styles.playlistTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.playlistDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <Feather name="chevron-right" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: playingFromFavorites ? NAV_BOTTOM + 200 : NAV_BOTTOM + SPACING.lg },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `fav-${item.id}`}
          renderItem={({ item }) => {
            const isActive = playingFromFavorites && favTracks[favCurrentIndex]?.id === item.id;
            const favPlaylist = playlists.find(p => p.id === item.playlist_id);
            const favCoverUrl = favPlaylist?.cover_image_url;
            return (
              <TouchableOpacity
                style={[styles.trackItem, isActive && styles.trackItemActive]}
                onPress={() => playFromFavorites(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.trackCoverWrap, { marginRight: SPACING.md }]}>
                  {favCoverUrl ? (
                    <Image source={{ uri: favCoverUrl }} style={{ width: 52, height: 52, borderRadius: 52 * 0.2 }} />
                  ) : (
                    <CoverPlaceholder name="Избранное" size={52} />
                  )}
                  {isActive && (
                    <View style={styles.trackCoverOverlay}>
                      {isLoadingAudio
                        ? <ActivityIndicator size="small" color={COLORS.white} />
                        : <Feather name={isPlaying ? 'pause' : 'play'} size={18} color={COLORS.white} />
                      }
                    </View>
                  )}
                </View>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {item.artist || 'Неизвестный исполнитель'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton} onPress={() => removeFromFavorites(item.id)}>
                  <Feather name="heart" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={[
            styles.listContent,
            { flexGrow: 1, paddingBottom: playingFromFavorites ? NAV_BOTTOM + 200 : NAV_BOTTOM + SPACING.lg },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="heart" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Нет избранных треков</Text>
              <Text style={styles.emptyText}>Нажмите ♡ у понравившегося трека</Text>
            </View>
          }
        />
      )}

      {playingFromFavorites && <BottomPlayer />}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  tabsContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    zIndex: 1,
  },
  tabActive: {},
  tabText: { ...TYPOGRAPHY.body2, color: COLORS.textMuted, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },

  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  coverPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: { flex: 1 },
  playlistTitle: { ...TYPOGRAPHY.body1, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  playlistDescription: { ...TYPOGRAPHY.caption, color: COLORS.textLight },

  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backButton: { padding: SPACING.sm },
  playerTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary, flex: 1, textAlign: 'center' },

  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  trackItemActive: { backgroundColor: COLORS.secondary },
  trackCoverWrap: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  trackCoverOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.40)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: { flex: 1, marginRight: SPACING.sm },
  trackTitle: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '500' },
  trackTitleActive: { color: COLORS.primary, fontWeight: '600' },
  trackArtist: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginTop: 2 },
  trackDuration: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 1, fontSize: 11 },
  favoriteButton: { padding: SPACING.sm },

  bottomPlayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.large,
  },

  playerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  playerTrackMeta: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  playerTrackTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  playerTrackArtist: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
  playerPlaylistLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  playerFavBtn: {
    padding: SPACING.xs,
  },

  progressTouchArea: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginLeft: -7,
    ...SHADOWS.small,
  },

  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    width: 36,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  controlBtn: { padding: SPACING.sm },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { ...TYPOGRAPHY.body2, color: COLORS.textLight },
  loader: { marginTop: SPACING.xl },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: { ...TYPOGRAPHY.h4, color: COLORS.primary },
  emptyText: { ...TYPOGRAPHY.body2, color: COLORS.textLight, textAlign: 'center' },
});
