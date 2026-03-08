import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SelectInputProps } from '../types';

/**
 * Default trigger input: shows value/placeholder and opens the modal on press.
 * Style-agnostic. Use customInput for themed UIs.
 */
export function DefaultSelectInput({
  value,
  onPress,
  placeholder = 'Select...',
  disabled = false,
  content,
}: SelectInputProps) {
  return (
    <Pressable
      style={[styles.trigger, disabled && styles.triggerDisabled]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {content != null ? (
        <View style={styles.triggerContent}>{content}</View>
      ) : (
        <Text
          style={[
            styles.triggerText,
            !value && styles.placeholder,
            disabled && styles.triggerTextDisabled,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      )}
      <Text style={[styles.chevron, disabled && styles.chevronDisabled]}>▼</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  triggerContent: {
    flex: 1,
    minWidth: 0,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#888',
  },
  triggerTextDisabled: {
    color: '#999',
  },
  chevron: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  chevronDisabled: {
    color: '#999',
  },
});
