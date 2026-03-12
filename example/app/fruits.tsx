import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Select } from 'react-native-aura-select';
import type { SelectRenderItemProps } from 'react-native-aura-select';
import { ShadcnSearchInput, ShadcnSelectInput } from './components/ShadcnInputs';
import { HeaderThemed, SurfaceThemed, TextThemed } from './context/Themed';
import { useTheme } from './context/ThemeContext';

interface FruitOption {
  label: string;
  value: string;
  emoji: string;
}

const FRUIT_OPTIONS: FruitOption[] = [
  { label: 'Apple', value: 'apple', emoji: '🍎' },
  { label: 'Banana', value: 'banana', emoji: '🍌' },
  { label: 'Cherry', value: 'cherry', emoji: '🍒' },
  { label: 'Grape', value: 'grape', emoji: '🍇' },
  { label: 'Lemon', value: 'lemon', emoji: '🍋' },
  { label: 'Orange', value: 'orange', emoji: '🍊' },
  { label: 'Peach', value: 'peach', emoji: '🍑' },
  { label: 'Strawberry', value: 'strawberry', emoji: '🍓' },
  { label: 'Watermelon', value: 'watermelon', emoji: '🍉' },
];

export default function FruitsExample() {
  const router = useRouter();
  const { modalTheme } = useTheme();
  const [selected, setSelected] = useState<FruitOption | null>(null);

  const getLabel = useCallback((item: FruitOption) => item.label, []);
  const getValue = useCallback((item: FruitOption) => item.value, []);

  const renderItem = useCallback(
    ({ item, isSelected, getLabel: gl, accentColor, color }: SelectRenderItemProps<FruitOption>) => (
      <View style={rowStyles.row}>
        <Text style={rowStyles.emoji}>{item.emoji}</Text>
        <Text style={[rowStyles.label, { color }]} numberOfLines={1}>
          {gl(item)}
        </Text>
        {isSelected ? (
          <Text style={[rowStyles.checkmark, { color: accentColor }]}>✓</Text>
        ) : null}
      </View>
    ),
    [],
  );

  return (
    <SurfaceThemed variant="screen">
      <HeaderThemed onBack={() => router.back()} title="Fruit Select" />
      <View style={styles.content}>
        <TextThemed variant="muted" style={styles.sectionLabel}>
          Choose a fruit (theme follows app setting)
        </TextThemed>
        <Select<FruitOption>
          options={FRUIT_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="Select a fruit..."
          modalTitle="Select a fruit"
          searchable
          modalTheme={modalTheme}
          customInput={ShadcnSelectInput}
          customSearchInput={ShadcnSearchInput}
          getLabel={getLabel}
          getValue={getValue}
          renderItem={renderItem}
        />
      </View>
    </SurfaceThemed>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 15,
    marginBottom: 12,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    flex: 1,
    fontSize: 16,
    minWidth: 0,
  },
  checkmark: {
    fontSize: 22,
    fontWeight: '600',
  },
});
