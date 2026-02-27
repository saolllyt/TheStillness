import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface AudioPlayerProps {
  currentTrack: {
    id: number;
    title: string;
    artist: string | null;
    audio_url: string;
  } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onTimeUpdate,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    if (currentTrack) {
      loadAudio();
    }
    return () => {
      unloadAudio();
    };
  }, [currentTrack]);

  useEffect(() => {
    if (sound) {
      if (isPlaying) {
        sound.playAsync();
      } else {
        sound.pauseAsync();
      }
    }
  }, [isPlaying, sound]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      await unloadAudio();
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack!.audio_url },
        { shouldPlay: isPlaying },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unloadAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setPosition(0);
      setDuration(0);
      progressAnimation.setValue(0);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      
      // для обновления времени
      if (onTimeUpdate) {
        onTimeUpdate(status.positionMillis / 1000);
      }
      
      const progress = status.positionMillis / (status.durationMillis || 1);
      progressAnimation.setValue(progress);
      
      if (status.didJustFinish) {
        if (onNext) {
          onNext();
        } else {
          onPlayPause();
        }
      }
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, SHADOWS.medium]}>
      {/* Прогресс-бар */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      {/* Контент плеера */}
      <View style={styles.content}>
        {/* Информация о треке */}
        <View style={styles.trackInfo}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist || 'Неизвестный исполнитель'}
            </Text>
          </View>
        </View>

        {/* Время слева от кнопок управления */}
        <View style={styles.timeLeftContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
        </View>

        {/* Элементы управления */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onPrevious}
            disabled={!hasPrevious}
          >
            <Feather 
              name="skip-back" 
              size={22} 
              color={hasPrevious ? COLORS.primary : COLORS.textMuted} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, isLoading && styles.disabledButton]}
            onPress={onPlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Feather 
                name={isPlaying ? 'pause' : 'play'} 
                size={20} 
                color={COLORS.white} 
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onNext}
            disabled={!hasNext}
          >
            <Feather 
              name="skip-forward" 
              size={22} 
              color={hasNext ? COLORS.primary : COLORS.textMuted} 
            />
          </TouchableOpacity>
        </View>

        {/* Время трека справа от кнопок */}
        <View style={styles.timeRightContainer}>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.small,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.border,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 64,
  },
  trackInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
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
    marginRight: SPACING.sm,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  timeRightContainer: {
    marginLeft: SPACING.sm,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  controlButton: {
    padding: SPACING.xs,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});