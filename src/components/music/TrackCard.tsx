import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface TrackCardProps {
  track: {
    id: number;
    title: string;
    artist: string | null;
    duration_seconds: number | null;
    audio_url: string;
    cover_url?: string | null;
  };
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: () => void;
  onPause: () => void;
  currentTime?: number; // Текущее время прослушивания
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  onPlay,
  onPause,
  currentTime = 0,
}) => {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isCurrentTrack && styles.currentTrack]}>
      {/* Обложка трека */}
      <View style={styles.coverContainer}>
        {track.cover_url ? (
          <Image 
            source={{ uri: track.cover_url }} 
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Feather name="music" size={20} color={COLORS.white} />
          </View>
        )}
      </View>

      {/* Информация о треке */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist || 'Неизвестный исполнитель'}
        </Text>
      </View>

      {/* Время */}
      <View style={styles.timeLeftContainer}>
        {isCurrentTrack ? (
          <Text style={styles.currentTimeText}>
            {formatCurrentTime(currentTime)}
          </Text>
        ) : (
          <Text style={styles.durationText}>
            {formatDuration(track.duration_seconds)}
          </Text>
        )}
      </View>

      {/* Кнопка воспроизведения */}
      <TouchableOpacity 
        style={styles.playButton}
        onPress={isCurrentTrack && isPlaying ? onPause : onPlay}
      >
        <Feather 
          name={isCurrentTrack && isPlaying ? 'pause-circle' : 'play-circle'} 
          size={36} 
          color={isCurrentTrack ? COLORS.primary : COLORS.textLight} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  currentTrack: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  coverContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 11,
  },
  timeLeftContainer: {
    marginRight: SPACING.xs,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  currentTimeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  durationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 12,
  },
  playButton: {
    padding: SPACING.xs,
  },
});