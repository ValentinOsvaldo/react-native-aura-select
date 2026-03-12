import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  SelectInputProps,
  SelectSearchInputProps,
} from 'react-native-aura-select';
import { useTheme } from '../context/ThemeContext';

const INPUT_RADIUS = 10;

/**
 * Themed trigger input (shadcn-style): rounded, adapts to dark/light theme.
 */
export function ShadcnSelectInput({
  value,
  onPress,
  placeholder = 'Select...',
  disabled = false,
  content,
}: SelectInputProps) {
  const { colors } = useTheme();
  const borderColor = colors.border;
  const backgroundColor = colors.card;
  const textColor = value ? colors.text : colors.muted;
  const chevronColor = colors.muted;

  return (
    <Pressable
      style={[
        styles.trigger,
        {
          borderColor,
          backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {content != null ? (
        <View style={styles.triggerContent}>{content}</View>
      ) : (
        <Text
          style={[styles.triggerText, { color: textColor }]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      )}
      <Text style={[styles.chevron, { color: chevronColor }]}>▼</Text>
    </Pressable>
  );
}

/**
 * Themed search input for modal (shadcn-style): rounded, adapts to theme.
 */
export function ShadcnSearchInput({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus,
}: SelectSearchInputProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.searchWrapper, { borderBottomColor: colors.border }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.background,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: INPUT_RADIUS,
  },
  triggerContent: {
    flex: 1,
    minWidth: 0,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  searchWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    height: 42,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: INPUT_RADIUS,
    fontSize: 16,
  },
});
