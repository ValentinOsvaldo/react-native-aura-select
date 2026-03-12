import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text as RNText,
  TextProps,
  View,
  ViewProps,
} from 'react-native';
import { useTheme } from './ThemeContext';

type TextVariant = 'default' | 'muted' | 'accent';

export interface TextThemedProps extends Omit<TextProps, 'style'> {
  variant?: TextVariant;
  style?: TextProps['style'];
}

export function TextThemed({
  variant = 'default',
  style,
  ...rest
}: TextThemedProps) {
  const { colors } = useTheme();
  const color =
    variant === 'muted' ? colors.muted : variant === 'accent' ? colors.accent : colors.text;
  return <RNText style={[{ color }, style]} {...rest} />;
}

type SurfaceVariant = 'screen' | 'card' | 'header';

export interface SurfaceThemedProps extends ViewProps {
  variant?: SurfaceVariant;
}

export function SurfaceThemed({
  variant = 'screen',
  style,
  ...rest
}: SurfaceThemedProps) {
  const { colors } = useTheme();
  const bg = variant === 'screen' ? colors.background : colors.card;
  const borderBottomWidth = variant === 'header' ? StyleSheet.hairlineWidth : undefined;
  const borderBottomColor = variant === 'header' ? colors.border : undefined;
  return (
    <View
      style={[
        variant === 'screen' && styles.screen,
        { backgroundColor: bg, borderBottomWidth, borderBottomColor },
        style,
      ]}
      {...rest}
    />
  );
}

export interface CardThemedProps extends Omit<React.ComponentProps<typeof Pressable>, 'style'> {
  style?: ViewProps['style'];
}

export function CardThemed({ style, children, ...rest }: CardThemedProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? colors.cardPressed : colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

type IconVariant = 'accent' | 'muted';

export interface IconThemedProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  variant?: IconVariant;
}

export function IconThemed({ name, size = 24, variant = 'accent' }: IconThemedProps) {
  const { colors } = useTheme();
  const color = variant === 'muted' ? colors.muted : colors.accent;
  return <Ionicons name={name} size={size} color={color} />;
}

/** Icon container with themed background (e.g. for list card icons) */
export interface IconBoxThemedProps extends ViewProps {
  children: React.ReactNode;
}

export function IconBoxThemed({ style, children, ...rest }: IconBoxThemedProps) {
  const { colors, isDark } = useTheme();
  const bg = isDark ? '#27272a' : '#f4f4f5';
  return (
    <View style={[styles.iconBox, { backgroundColor: bg }, style]} {...rest}>
      {children}
    </View>
  );
}

export interface HeaderThemedProps {
  onBack: () => void;
  title: string;
}

export function HeaderThemed({ onBack, title }: HeaderThemedProps) {
  return (
    <SurfaceThemed variant="header" style={styles.header}>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
        <IconThemed name="arrow-back" size={24} />
      </Pressable>
      <TextThemed style={styles.headerTitle}>{title}</TextThemed>
    </SurfaceThemed>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
});
