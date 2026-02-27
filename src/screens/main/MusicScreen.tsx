import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { PlaylistCard } from '../../components/music/PlaylistCard';
import { TrackCard } from '../../components/music/TrackCard';
import { AudioPlayer } from '../../components/music/AudioPlayer';

const MOCK_PLAYLISTS = [
  {
    id: 1,
    title: 'Спокойствие',
    description: 'Мягкие инструментальные композиции для релаксации',
    cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    tracks: [
      {
        id: 101,
        title: 'Глубокий вдох',
        artist: 'Relaxation Lab',
        duration_seconds: 185,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200',
      },
      {
        id: 102,
        title: 'Морской прибой',
        artist: 'Nature Sounds',
        duration_seconds: 242,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        cover_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200',
      },
      {
        id: 103,
        title: 'Лесной ручей',
        artist: 'Nature Sounds',
        duration_seconds: 198,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
      },
    ],
  },
  {
    id: 2,
    title: 'Без тревоги',
    description: 'Музыка для снижения стресса и тревожности',
    cover_image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    tracks: [
      {
        id: 201,
        title: 'Утренняя роса',
        artist: 'Piano Dreams',
        duration_seconds: 215,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        cover_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      },
      {
        id: 202,
        title: 'Тихий вечер',
        artist: 'Piano Dreams',
        duration_seconds: 188,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        cover_url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=200',
      },
    ],
  },
  {
    id: 3,
    title: 'Фокус',
    description: 'Энергичные треки для концентрации и работы',
    cover_image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
    tracks: [
      {
        id: 301,
        title: 'Поток',
        artist: 'Electronic Dreams',
        duration_seconds: 221,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        cover_url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200',
      },
      {
        id: 302,
        title: 'Ритм',
        artist: 'Electronic Dreams',
        duration_seconds: 197,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200',
      },
      {
        id: 303,
        title: 'Импульс',
        artist: 'Electronic Dreams',
        duration_seconds: 203,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        cover_url: 'https://images.unsplash.com/photo-1477233534935-f5e6fe7c115b?w=200',
      },
    ],
  },
];

export const MusicScreen = () => {
  const [playlists] = useState(MOCK_PLAYLISTS);
  const [selectedPlaylist, setSelectedPlaylist] = useState<typeof MOCK_PLAYLISTS[0] | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Настройка аудиосессии
  useEffect(() => {
    const configureAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    
    configureAudio();
  }, []);

  // Обновление текущего времени
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSelectPlaylist = (playlist: typeof MOCK_PLAYLISTS[0]) => {
    setSelectedPlaylist(playlist);
    // НЕ сбрасываем, чтобы плеер продолжал играть, пока пользователь смотрит другие плейлисты
  };

  const handlePlayTrack = (track: any, index: number, playlistId: number) => {
    // Проверяем, из того ли плейлиста текущий трек
    const isFromSamePlaylist = selectedPlaylist?.id === playlistId;
    
    if (currentTrack?.id === track.id) {
      // Если это тот же трек, переключаем воспроизведение
      setIsPlaying(!isPlaying);
    } else {
      // Если новый трек, загружаем и играем
      setCurrentTrack(track);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setCurrentTime(0);
      
      // Если трек из другого плейлиста, автоматически переключаем выбранный плейлист
      if (!isFromSamePlaylist) {
        const newPlaylist = playlists.find(p => p.id === playlistId);
        if (newPlaylist) {
          setSelectedPlaylist(newPlaylist);
        }
      }
    }
  };

  const handlePauseTrack = () => {
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    if (selectedPlaylist && currentTrackIndex < selectedPlaylist.tracks.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      const nextTrack = selectedPlaylist.tracks[nextIndex];
      setCurrentTrack(nextTrack);
      setCurrentTrackIndex(nextIndex);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handlePreviousTrack = () => {
    if (selectedPlaylist && currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      const prevTrack = selectedPlaylist.tracks[prevIndex];
      setCurrentTrack(prevTrack);
      setCurrentTrackIndex(prevIndex);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Музыка</Text>
        <Text style={styles.subtitle}>
          Плейлисты для релаксации и спокойствия
        </Text>
      </View>
    </View>
  );

  const renderPlaylists = () => (
    <View style={styles.playlistsSection}>
      <Text style={styles.sectionTitle}>Плейлисты</Text>
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isActive={selectedPlaylist?.id === playlist.id}
          onPress={() => handleSelectPlaylist(playlist)}
        />
      ))}
    </View>
  );

  const renderTracks = () => {
    if (!selectedPlaylist) return null;

    return (
      <View style={styles.tracksSection}>
        <View style={styles.tracksHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedPlaylist(null)}
          >
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.tracksTitleContainer}>
            <Text style={styles.playlistTitle}>{selectedPlaylist.title}</Text>
            <Text style={styles.playlistDescription}>{selectedPlaylist.description}</Text>
          </View>
        </View>

        {selectedPlaylist.tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={isPlaying}
            isCurrentTrack={currentTrack?.id === track.id}
            onPlay={() => handlePlayTrack(track, index, selectedPlaylist.id)}
            onPause={handlePauseTrack}
            currentTime={currentTime}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={() => 'key'}
        renderItem={null}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {!selectedPlaylist ? renderPlaylists() : renderTracks()}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Аудиоплеер */}
      {currentTrack && (
        <AudioPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNext={selectedPlaylist && currentTrackIndex < selectedPlaylist.tracks.length - 1 ? handleNextTrack : undefined}
          onPrevious={selectedPlaylist && currentTrackIndex > 0 ? handlePreviousTrack : undefined}
          hasNext={selectedPlaylist ? currentTrackIndex < selectedPlaylist.tracks.length - 1 : false}
          hasPrevious={selectedPlaylist ? currentTrackIndex > 0 : false}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  playlistsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  tracksSection: {
    marginBottom: SPACING.xl,
  },
  tracksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  tracksTitleContainer: {
    flex: 1,
  },
  playlistTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: 2,
  },
  playlistDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
});