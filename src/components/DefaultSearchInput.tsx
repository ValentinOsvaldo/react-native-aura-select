import { StyleSheet, TextInput, View } from 'react-native';
import type { SelectSearchInputProps } from '../types';

/**
 * Default search input used inside the modal.
 * Style-agnostic. Use customSearchInput for themed UIs.
 */
export function DefaultSearchInput({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus,
}: SelectSearchInputProps) {
  return (
    <View style={styles.searchWrapper}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
});
