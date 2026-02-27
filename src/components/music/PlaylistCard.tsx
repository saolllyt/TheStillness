import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface PlaylistCardProps {
  playlist: {
    id: number;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    tracks?: any[];
  };
  isActive: boolean;
  onPress: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isActive && styles.activeContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverContainer}>
        {playlist.cover_image_url ? (
          <Image 
            source={{ uri: playlist.cover_image_url }} 
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Feather name="headphones" size={32} color={COLORS.white} />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{playlist.title}</Text>
        {playlist.description && (
          <Text style={styles.description} numberOfLines={2}>
            {playlist.description}
          </Text>
        )}
        <Text style={styles.trackCount}>
          {playlist.tracks?.length || 0} треков
        </Text>
      </View>

      <Feather 
        name="chevron-right" 
        size={24} 
        color={isActive ? COLORS.primary : COLORS.textLight} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm, 
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary + '20',
  },
  coverContainer: {
    width: 80, 
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginRight: SPACING.md,
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
    paddingVertical: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  trackCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
});