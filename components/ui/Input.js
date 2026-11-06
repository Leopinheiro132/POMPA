import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZE } from '../../constants/theme';

export function Input({ label, value, onChangeText, placeholder, keyboardType = 'default', suffix, multiline = false, editable = true, style }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            !editable && styles.disabled,
          ]}
          value={String(value ?? '')}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  disabled: {
    opacity: 0.6,
  },
  suffix: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
});
