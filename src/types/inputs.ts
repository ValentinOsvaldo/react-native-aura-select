import type { ReactNode } from 'react';

/** Props passed to the custom input (trigger) component */
export interface SelectInputProps {
  /** Fallback text when no custom content (e.g. for a11y or when content is not used). */
  value: string;
  onPress: () => void;
  placeholder?: string;
  editable?: false;
  /** When true, the trigger should not open the modal and should look disabled. */
  disabled?: boolean;
  /** When set, render this instead of value/placeholder (e.g. chips for selected items). */
  content?: ReactNode;
}

/** Props passed to the custom search input inside the modal */
export interface SelectSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}
