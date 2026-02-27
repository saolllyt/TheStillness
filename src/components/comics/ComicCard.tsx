import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface ComicCardProps {
  comic: {
    id: number;
    title: string;
    description: string | null;
    cover_image_url: string;
    author: string | null;
  };
  onPress: () => void;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: comic.cover_image_url || 'https://via.placeholder.com/300x400?text=TheStillness' }} 
          style={styles.cover}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{comic.title}</Text>
        {comic.author && (
          <Text style={styles.author}>{comic.author}</Text>
        )}
        {comic.description && (
          <Text style={styles.description} numberOfLines={3}>
            {comic.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  coverContainer: {
    width: 100, 
    height: 140, 
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.h4,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  author: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
});