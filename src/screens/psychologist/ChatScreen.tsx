import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api/client';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  report_id: number | null;
  report_data: any;
  is_read: boolean;
  created_at: string;
  sender_first_name: string | null;
  sender_last_name: string | null;
}

interface ChatScreenProps {
  navigation: any;
  route: {
    params: {
      otherUserId: number;
      otherUserName: string;
    };
  };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { otherUserId, otherUserName } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [showReports, setShowReports] = useState(false);
  const [openingReport, setOpeningReport] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<any>(null);

  const loadMessages = useCallback(async () => {
    try {
      const response = await api.get(`/psychologist/conversation/${otherUserId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Load messages error:', error);
    }
  }, [otherUserId]);

  const loadReports = async () => {
    try {
      if ((user as any)?.role === 'psychologist') {
        // Психолог отправляет клинические отчёты
        const response = await api.get(`/psychologist-reports?patientId=${otherUserId}`);
        setReports(response.data.data || []);
      } else {
        // Пациент отправляет мониторинговые отчёты
        const response = await api.get('/profile/report/list');
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error('Load reports error:', error);
    }
  };

  useFocusEffect(useCallback(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
    loadReports();
    intervalRef.current = setInterval(loadMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadMessages]));

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      await api.post('/psychologist/messages', {
        receiverId: otherUserId,
        content: text.trim(),
      });
      setText('');
      await loadMessages();
    } catch {
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleSendReport = async (report: any) => {
    try {
      if ((user as any)?.role === 'psychologist') {
        // Клинический отчёт психолога — отправляем как JSON-сообщение
        const content = JSON.stringify({
          type: 'psychologist_report',
          report_date: report.report_date,
          psych_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email,
          complaints: report.complaints,
          recommendations: report.recommendations,
          id: report.id,
        });
        await api.post('/psychologist/messages', { receiverId: otherUserId, content });
      } else {
        await api.post('/psychologist/messages/report', {
          receiverId: otherUserId,
          reportId: report.id,
        });
      }
      setShowReports(false);
      await loadMessages();
    } catch {
      Alert.alert('Ошибка', 'Не удалось отправить отчёт');
    }
  };

  const handleOpenReport = (reportData: any, reportId: number) => {
    navigation.navigate('ReportViewer', {
      reportData,
      userName: reportData.user?.name || otherUserName,
      reportId,
    });
  };

  const handleOpenPsychReport = (psychReport: any) => {
    const patientName = (user as any)?.role === 'psychologist'
      ? otherUserName
      : `${(user as any)?.first_name || ''} ${(user as any)?.last_name || ''}`.trim()
        || (user as any)?.email
        || otherUserName;

    navigation.navigate('PsychReportViewer', {
      report: psychReport,
      patientName,
    });
  };

  const isMyMessage = (msg: Message) => msg.sender_id === user?.id;
  const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm', { locale: ru });
  const formatDate = (dateStr: string) => format(new Date(dateStr), 'd MMMM', { locale: ru });

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMine = isMyMessage(item);
    const prevMessage = messages[index - 1];
    const showDate = !prevMessage ||
      formatDate(prevMessage.created_at) !== formatDate(item.created_at);

    let reportData = item.report_data;
    if (reportData && typeof reportData === 'string') {
      try { reportData = JSON.parse(reportData); } catch { reportData = null; }
    }

    let psychReport: any = null;
    if (!item.report_id) {
      try {
        const parsed = JSON.parse(item.content);
        if (parsed.type === 'psychologist_report') psychReport = parsed;
      } catch {}
    }

    const isReport = item.report_id && reportData;
    const isPsychReport = !!psychReport;

    return (
      <View>
        {showDate && (
          <View style={{ alignItems: 'center', marginVertical: SPACING.md }}>
            <Text style={{
              ...TYPOGRAPHY.caption,
              color: COLORS.textMuted,
              backgroundColor: COLORS.border,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.xs,
              borderRadius: BORDER_RADIUS.round,
            }}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}

        <View style={{
          flexDirection: 'row',
          marginBottom: SPACING.xs,
          justifyContent: isMine ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          gap: SPACING.xs,
        }}>
          {/* Карточка отчёта пользователя */}
          {isReport ? (
            <TouchableOpacity
              style={{
                width: 220,
                backgroundColor: isMine ? COLORS.primary : COLORS.secondary,
                borderRadius: BORDER_RADIUS.lg,
                borderBottomRightRadius: isMine ? 4 : BORDER_RADIUS.lg,
                borderBottomLeftRadius: isMine ? BORDER_RADIUS.lg : 4,
                overflow: 'hidden',
                ...SHADOWS.small,
              }}
              onPress={() => handleOpenReport(reportData, item.report_id!)}
              activeOpacity={0.8}
              disabled={openingReport === item.report_id}
            >
              <View style={{
                backgroundColor: isMine ? 'rgba(255,255,255,0.15)' : COLORS.secondaryMid,
                padding: SPACING.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.sm,
              }}>
                {openingReport === item.report_id
                  ? <ActivityIndicator size="small" color={isMine ? COLORS.white : COLORS.primary} />
                  : <Feather name="file-text" size={18} color={isMine ? COLORS.white : COLORS.primary} />
                }
                <Text style={{
                  ...TYPOGRAPHY.body2,
                  color: isMine ? COLORS.white : COLORS.primary,
                  fontWeight: '700',
                }}>
                  Психологический отчёт
                </Text>
              </View>
              <View style={{ padding: SPACING.md }}>
                <Text style={{
                  ...TYPOGRAPHY.caption,
                  color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.primaryLight,
                  marginBottom: 4,
                }}>
                  {reportData.startDate} — {reportData.endDate}
                </Text>
                {reportData.summary && (
                  <Text style={{
                    ...TYPOGRAPHY.caption,
                    color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.primaryLight,
                  }}>
                    Эмоций: {reportData.summary.totalEmotions} · Записей: {reportData.summary.totalDiary}
                  </Text>
                )}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: SPACING.xs,
                  gap: 4,
                  borderTopWidth: 1,
                  borderTopColor: isMine ? 'rgba(255,255,255,0.2)' : COLORS.border,
                  paddingTop: SPACING.xs,
                }}>
                  <Feather name="download" size={12} color={isMine ? 'rgba(255,255,255,0.9)' : COLORS.primary} />
                  <Text style={{
                    ...TYPOGRAPHY.caption,
                    color: isMine ? 'rgba(255,255,255,0.9)' : COLORS.primary,
                    fontWeight: '500',
                  }}>
                    {openingReport === item.report_id ? 'Открываем...' : 'Открыть PDF'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

          ) : isPsychReport ? (
            /* Карточка отчёта психолога  */
            <TouchableOpacity
              style={{
                width: 220,
                backgroundColor: isMine ? COLORS.primary : COLORS.secondary,
                borderRadius: BORDER_RADIUS.lg,
                borderBottomRightRadius: isMine ? 4 : BORDER_RADIUS.lg,
                borderBottomLeftRadius: isMine ? BORDER_RADIUS.lg : 4,
                overflow: 'hidden',
                ...SHADOWS.small,
              }}
              onPress={() => handleOpenPsychReport(psychReport)}
              activeOpacity={0.8}
            >
              <View style={{
                backgroundColor: isMine ? 'rgba(255,255,255,0.15)' : COLORS.secondaryMid,
                padding: SPACING.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.sm,
              }}>
                <Feather name="file-text" size={18} color={isMine ? COLORS.white : COLORS.primary} />
                <Text style={{
                  ...TYPOGRAPHY.body2,
                  color: isMine ? COLORS.white : COLORS.primary,
                  fontWeight: '700',
                  flex: 1,
                }} numberOfLines={1}>
                  Результат мониторинга
                </Text>
              </View>
              <View style={{ padding: SPACING.md }}>
                <Text style={{
                  ...TYPOGRAPHY.caption,
                  color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.primaryLight,
                  marginBottom: 4,
                }}>
                  Дата: {new Date(psychReport.report_date).toLocaleDateString('ru-RU')}
                </Text>
                {psychReport.psych_name && (
                  <Text style={{
                    ...TYPOGRAPHY.caption,
                    color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.primaryLight,
                  }}>
                    Психолог: {psychReport.psych_name}
                  </Text>
                )}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: SPACING.xs,
                  gap: 4,
                  borderTopWidth: 1,
                  borderTopColor: isMine ? 'rgba(255,255,255,0.2)' : COLORS.border,
                  paddingTop: SPACING.xs,
                }}>
                  <Feather name="eye" size={12} color={isMine ? 'rgba(255,255,255,0.9)' : COLORS.primary} />
                  <Text style={{
                    ...TYPOGRAPHY.caption,
                    color: isMine ? 'rgba(255,255,255,0.9)' : COLORS.primary,
                    fontWeight: '500',
                  }}>
                    Открыть отчёт
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

          ) : (
            /* Обычное сообщение  у собеседника */
            <View style={{
              maxWidth: '75%',
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: isMine ? COLORS.primary : COLORS.secondary,
              borderBottomRightRadius: isMine ? 4 : BORDER_RADIUS.lg,
              borderBottomLeftRadius: isMine ? BORDER_RADIUS.lg : 4,
              ...SHADOWS.small,
            }}>
              <Text style={{
                ...TYPOGRAPHY.body2,
                color: isMine ? COLORS.white : COLORS.primary,
              }}>
                {item.content}
              </Text>
              <Text style={{
                ...TYPOGRAPHY.caption,
                color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.primaryLight,
                fontSize: 10,
                marginTop: 4,
                textAlign: 'right',
              }}>
                {formatTime(item.created_at)}
                {isMine ? (item.is_read ? ' ✓✓' : ' ✓') : ''}
              </Text>
            </View>
          )}

          {/* Время для карточек отчётов */}
          {(isReport || isPsychReport) && (
            <Text style={{
              ...TYPOGRAPHY.caption,
              color: COLORS.textMuted,
              fontSize: 10,
              marginBottom: SPACING.xs,
            }}>
              {formatTime(item.created_at)}
              {isMine ? (item.is_read ? ' ✓✓' : ' ✓') : ''}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Шапка */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.white }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          ...SHADOWS.small,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: SPACING.sm }}
          >
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <View style={{
              width: 36, height: 36,
              borderRadius: 18,
              backgroundColor: COLORS.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>
                {otherUserName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={{
              ...TYPOGRAPHY.body1,
              color: COLORS.primary,
              fontWeight: '600',
              flex: 1,
            }} numberOfLines={1}>
              {otherUserName}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{
              paddingHorizontal: SPACING.md,
              paddingTop: SPACING.md,
              paddingBottom: SPACING.md,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 120, gap: SPACING.md }}>
                <Feather name="message-circle" size={48} color={COLORS.textMuted} />
                <Text style={{ ...TYPOGRAPHY.body1, color: COLORS.textLight }}>
                  Начните переписку
                </Text>
              </View>
            }
          />
        )}

        {/* Панель отчётов */}
        {showReports && (
          <View style={{
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            padding: SPACING.lg,
            maxHeight: 220,
          }}>
            <Text style={{
              ...TYPOGRAPHY.body2,
              color: COLORS.primary,
              fontWeight: '600',
              marginBottom: SPACING.sm,
            }}>
              Выберите отчёт для отправки:
            </Text>
            {reports.length === 0 ? (
              <Text style={{ ...TYPOGRAPHY.body2, color: COLORS.textLight }}>
                {(user as any)?.role === 'psychologist'
                  ? 'Нет составленных отчётов для этого пациента.'
                  : 'Нет сгенерированных отчётов. Сначала сформируйте отчёт в профиле.'}
              </Text>
            ) : (
              reports.slice(0, 5).map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.sm,
                    paddingVertical: SPACING.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                  }}
                  onPress={() => handleSendReport(report)}
                >
                  <Feather name="file-text" size={16} color={COLORS.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...TYPOGRAPHY.body2, color: COLORS.text }}>
                      {(user as any)?.role === 'psychologist'
                        ? `Отчёт от ${new Date(report.report_date).toLocaleDateString('ru-RU')}`
                        : `${report.start_date} — ${report.end_date}`}
                    </Text>
                    <Text style={{ ...TYPOGRAPHY.caption, color: COLORS.textLight }}>
                      Нажмите чтобы отправить
                    </Text>
                  </View>
                  <Feather name="send" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              onPress={() => setShowReports(false)}
              style={{ marginTop: SPACING.sm, alignItems: 'center' }}
            >
              <Text style={{ ...TYPOGRAPHY.body2, color: COLORS.error }}>Отмена</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Поле ввода */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          gap: SPACING.sm,
          paddingBottom: Math.max(SPACING.sm, insets.bottom),
        }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setShowReports(!showReports)}
          >
            <Feather name="paperclip" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              backgroundColor: COLORS.secondary,
              borderRadius: BORDER_RADIUS.lg,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.sm,
              minHeight: 40,
              maxHeight: 100,
              color: COLORS.text,
              fontSize: 16,
            }}
            value={text}
            onChangeText={setText}
            placeholder="Сообщение..."
            placeholderTextColor={COLORS.textMuted}
            multiline
          />

          <TouchableOpacity
            style={{
              width: 40, height: 40,
              borderRadius: 20,
              backgroundColor: text.trim() ? COLORS.primary : COLORS.secondaryMid,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color={COLORS.white} />
              : <Feather name="send" size={18} color={text.trim() ? COLORS.white : COLORS.primary} />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};