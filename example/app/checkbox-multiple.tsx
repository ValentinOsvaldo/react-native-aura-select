import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Select } from 'react-native-aura-select';
import type { SelectRenderItemProps } from 'react-native-aura-select';
import { ShadcnSearchInput, ShadcnSelectInput } from './components/ShadcnInputs';
import { HeaderThemed, SurfaceThemed, TextThemed } from './context/Themed';
import { useTheme } from './context/ThemeContext';

interface ToppingOption {
  id: string;
  label: string;
}

const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'cheese', label: 'Extra cheese' },
  { id: 'pepperoni', label: 'Pepperoni' },
  { id: 'mushrooms', label: 'Mushrooms' },
  { id: 'olives', label: 'Olives' },
  { id: 'onions', label: 'Onions' },
  { id: 'peppers', label: 'Bell peppers' },
  { id: 'sausage', label: 'Sausage' },
  { id: 'bacon', label: 'Bacon' },
];

function ToppingRow({
  item,
  isSelected,
  getLabel,
  accentColor,
  color,
}: SelectRenderItemProps<ToppingOption>) {
  return (
    <View style={rowStyles.row}>
      <Checkbox
        value={isSelected}
        onValueChange={() => {}}
        color={accentColor}
        style={rowStyles.checkbox}
      />
      <Text style={[rowStyles.label, { color }]} numberOfLines={1}>
        {getLabel(item)}
      </Text>
    </View>
  );
}

export default function CheckboxMultipleExample() {
  const router = useRouter();
  const { modalTheme } = useTheme();
  const [selected, setSelected] = useState<ToppingOption[]>([]);

  const getLabel = useCallback((item: ToppingOption) => item.label, []);
  const getValue = useCallback((item: ToppingOption) => item.id, []);

  const formatMultipleLabel = useCallback((items: ToppingOption[]) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0]!.label;
    return `${items.length} toppings selected`;
  }, []);

  return (
    <SurfaceThemed variant="screen">
      <HeaderThemed onBack={() => router.back()} title="Multiple (Checkbox)" />
      <View style={styles.content}>
        <TextThemed variant="muted" style={styles.sectionLabel}>
          Pizza toppings (multi-select)
        </TextThemed>
        <Select<ToppingOption>
          options={TOPPING_OPTIONS}
          value={selected}
          onChange={setSelected}
          multiple
          placeholder="Select toppings..."
          modalTitle="Select toppings"
          searchable
          clearable
          customInput={ShadcnSelectInput}
          customSearchInput={ShadcnSearchInput}
          getLabel={getLabel}
          getValue={getValue}
          renderItem={(props) => <ToppingRow {...props} />}
          formatMultipleLabel={formatMultipleLabel}
          modalTheme={modalTheme}
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
  checkbox: {
    marginVertical: 2,
  },
  label: {
    flex: 1,
    fontSize: 16,
    minWidth: 0,
  },
});
