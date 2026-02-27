import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from './Button';

interface TextAreaModalProps {
  visible: boolean;
  title: string;
  value: string;
  placeholder?: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

export const TextAreaModal: React.FC<TextAreaModalProps> = ({
  visible,
  title,
  value,
  placeholder,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState(value);

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            multiline
            textAlignVertical="top"
            autoFocus
          />

          <View style={styles.buttons}>
            <Button
              title="Отмена"
              onPress={onClose}
              variant="outline"
              size="medium"
              style={styles.cancelButton}
            />
            <Button
              title="Сохранить"
              onPress={handleSave}
              variant="primary"
              size="medium"
              style={styles.saveButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  input: {
    ...TYPOGRAPHY.body1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});