import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import {
  CardThemed,
  IconBoxThemed,
  IconThemed,
  TextThemed,
} from './context/Themed';
import { useTheme } from './context/ThemeContext';

const EXAMPLES = [
  {
    id: 'fruits',
    title: 'Fruit Select (Dark Theme)',
    description: 'Single select with fruit emojis and dark modal theme.',
    icon: 'nutrition' as const,
    route: '/fruits',
  },
  {
    id: 'checkbox-multiple',
    title: 'Multiple Selection (Checkbox)',
    description: 'Multi-select using Expo Checkbox in each option row.',
    icon: 'checkbox' as const,
    route: '/checkbox-multiple',
  },
  {
    id: 'users-api',
    title: 'Users from API (Avatars)',
    description: 'Options from JSONPlaceholder with avatar and label.',
    icon: 'people' as const,
    route: '/users-api',
  },
  {
    id: 'virtualized',
    title: 'Virtualized List (FlashList)',
    description: 'Large list with many options for smooth scrolling.',
    icon: 'list' as const,
    route: '/virtualized',
  },
] as const;

export default function ExamplesIndex() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();

  const handleExamplePress = useCallback(
    (route: string) => {
      router.push(route as '/fruits' | '/checkbox-multiple' | '/users-api' | '/virtualized');
    },
    [router],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <TextThemed style={styles.title}>Aura Select Examples</TextThemed>
          <TextThemed variant="muted" style={styles.subtitle}>
            Tap an example to open it.
          </TextThemed>
        </View>
        <View style={styles.switchRow}>
          <TextThemed variant="muted" style={styles.switchLabel}>
            Dark mode
          </TextThemed>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>
      </View>

      {EXAMPLES.map((example) => (
        <CardThemed
          key={example.id}
          onPress={() => handleExamplePress(example.route)}
          accessibilityRole="button"
          accessibilityLabel={example.title}
        >
          <IconBoxThemed>
            <IconThemed name={example.icon} size={28} />
          </IconBoxThemed>
          <View style={styles.cardBody}>
            <TextThemed style={styles.cardTitle}>{example.title}</TextThemed>
            <TextThemed variant="muted" style={styles.cardDescription}>
              {example.description}
            </TextThemed>
          </View>
          <IconThemed name="chevron-forward" size={22} variant="muted" />
        </CardThemed>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 4,
  },
  switchLabel: {
    fontSize: 15,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
