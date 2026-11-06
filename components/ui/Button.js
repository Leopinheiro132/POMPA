import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled = false, loading = false, icon, style }) {
  const variantStyles = {
    primary: { bg: COLORS.amber, text: COLORS.textDark },
    secondary: { bg: COLORS.bgCard, text: COLORS.textPrimary },
    danger: { bg: COLORS.red, text: '#fff' },
    success: { bg: COLORS.emerald, text: '#fff' },
    ghost: { bg: 'transparent', text: COLORS.amber },
    outline: { bg: 'transparent', text: COLORS.amber },
  };

  const sizeStyles = {
    sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, fontSize: FONT_SIZE.sm },
    md: { paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.lg, fontSize: FONT_SIZE.md },
    lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, fontSize: FONT_SIZE.lg },
  };

  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: vs.bg,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
        },
        variant === 'outline' && { borderWidth: 1, borderColor: COLORS.amber },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.text, { color: vs.text, fontSize: ss.fontSize }, icon && { marginLeft: SPACING.xs }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  text: {
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
