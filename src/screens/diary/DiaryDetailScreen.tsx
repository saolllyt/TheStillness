import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';

interface DiaryDetailScreenProps {
  navigation: any;
  route: {
    params: {
      entry: any;
    };
  };
}

export const DiaryDetailScreen: React.FC<DiaryDetailScreenProps> = ({ navigation, route }) => {
  const { entry } = route.params;

  const formattedDate = format(new Date(entry.entry_date), 'd MMMM yyyy', { locale: ru });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Запись от {formattedDate}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('DiaryEntry', { entry })}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Место */}
        {entry.situation_place && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Место</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>{entry.situation_place}</Text>
            </View>
          </View>
        )}

        {/* Ситуация */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ситуация</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.situation_description}</Text>
          </View>
        </View>

        {/* Мысли */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="message-circle" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Мысли</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.thoughts}</Text>
          </View>
        </View>

        {/* Эмоции */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Эмоции</Text>
          </View>
          <View style={styles.emotionsCard}>
            {entry.selected_emotions.map((emotion: any, index: number) => (
              <View key={index} style={styles.emotionItem}>
                <Text style={styles.emotionEmoji}>{emotion.emoji || '😊'}</Text>
                <View style={styles.emotionInfo}>
                  <Text style={styles.emotionName}>{emotion.emotionName}</Text>
                  {emotion.intensity && (
                    <View style={styles.intensityBar}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <View
                          key={i}
                          style={[
                            styles.intensityDot,
                            emotion.intensity >= i * 2 && styles.intensityDotActive
                          ]}
                        />
                      ))}
                      <Text style={styles.intensityText}>{emotion.intensity}/10</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Действия */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="activity" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Действия</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>{entry.reaction_description}</Text>
          </View>
        </View>

        {/* Дата создания */}
        <Text style={styles.createdAt}>
          Создано: {format(new Date(entry.created_at || entry.entry_date), 'dd.MM.yyyy HH:mm')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  cardText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    lineHeight: 24,
  },
  emotionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  emotionEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  emotionInfo: {
    flex: 1,
  },
  emotionName: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  intensityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.border,
  },
  intensityDotActive: {
    backgroundColor: COLORS.primary,
  },
  intensityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  createdAt: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});