import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Select } from 'react-native-aura-select';
import type { SelectListProps } from 'react-native-aura-select';
import { ShadcnSearchInput, ShadcnSelectInput } from './components/ShadcnInputs';
import { HeaderThemed, SurfaceThemed, TextThemed } from './context/Themed';
import { useTheme } from './context/ThemeContext';

const OPTION_COUNT = 1000;

interface VirtualOption {
  id: number;
  label: string;
}

function buildVirtualOptions(): VirtualOption[] {
  return Array.from({ length: OPTION_COUNT }, (_, i) => ({
    id: i + 1,
    label: `Option ${i + 1}`,
  }));
}

const VIRTUAL_OPTIONS = buildVirtualOptions();

function VirtualizedListRenderer<T>({
  data,
  renderItem,
  keyExtractor,
  contentContainerStyle,
}: SelectListProps<T>) {
  const flashListProps = {
    data,
    renderItem: ({ item, index }: { item: T; index: number }) =>
      renderItem({ item, index }) as React.ReactElement | null,
    keyExtractor,
    estimatedItemSize: 52,
    contentContainerStyle,
    keyboardShouldPersistTaps: 'handled' as const,
  };
  return (
    <FlashList
      {...(flashListProps as React.ComponentProps<typeof FlashList>)}
    />
  );
}

function VirtualizedListWrapper(props: SelectListProps<VirtualOption>) {
  return <VirtualizedListRenderer {...props} />;
}

export default function VirtualizedExample() {
  const router = useRouter();
  const { modalTheme } = useTheme();
  const [selected, setSelected] = useState<VirtualOption | null>(null);

  const renderList = useMemo(() => VirtualizedListWrapper, []);

  return (
    <SurfaceThemed variant="screen">
      <HeaderThemed
        onBack={() => router.back()}
        title="Virtualized (FlashList)"
      />
      <View style={styles.content}>
        <TextThemed variant="muted" style={styles.sectionLabel}>
          {OPTION_COUNT} options — smooth scrolling with FlashList
        </TextThemed>
        <Select<VirtualOption>
          options={VIRTUAL_OPTIONS}
          value={selected}
          onChange={setSelected}
          placeholder="Select an option..."
          modalTitle={`Select (${OPTION_COUNT} items)`}
          searchable
          customInput={ShadcnSelectInput}
          customSearchInput={ShadcnSearchInput}
          labelKey="label"
          valueKey="id"
          keyExtractor={(item) => String(item.id)}
          renderList={renderList}
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
