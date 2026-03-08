import { useState } from 'react';
import { View } from 'react-native';
import { Select } from 'react-native-aura-select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export default function Index() {
  const [selected, setSelected] = useState<(typeof options)[0] | null>(null);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Select
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder="Select a fruit..."
        modalTitle="Select a fruit"
        searchable
      />
    </View>
  );
}
