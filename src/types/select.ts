import type { ComponentType, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SelectInputProps, SelectSearchInputProps } from './inputs';

/** Props passed to renderList for custom list rendering (e.g. FlashList instead of FlatList). */
export interface SelectListProps<T> {
  /** Options to display in the list (already filtered when searchable). */
  data: T[];
  /** Render a single option row. Same contract as FlatList/FlashList renderItem. */
  renderItem: (info: { item: T; index: number }) => ReactNode;
  /** Key for each item. Same as keyExtractor from Select props. */
  keyExtractor: (item: T, index: number) => string;
  /** Suggested content container style for the list (optional). */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/** Props passed to renderTriggerContent for custom trigger/chip rendering */
export interface SelectTriggerContentProps<T> {
  /** Currently selected items. */
  items: T[];
  /** Get display label for an item. */
  getLabel: (item: T) => string;
  /** Get identity/value for an item (e.g. for keys). */
  getValue: (item: T) => unknown;
}

/** Props passed to renderItem for custom option row rendering (checkbox, icon, colors, etc.) */
export interface SelectRenderItemProps<T> {
  /** The option item. */
  item: T;
  /** Whether this option is currently selected. */
  isSelected: boolean;
  /** Get display label for the item. */
  getLabel: (item: T) => string;
  /** Get identity/value for the item (e.g. for keys). */
  getValue: (item: T) => unknown;
  /** Accent color from modal theme (e.g. for checkmark/checkbox). */
  accentColor: string;
  /** Primary text color from modal theme. */
  color: string;
  /** Border color from modal theme. */
  borderColor: string;
  /** Secondary/muted color from modal theme. */
  secondaryColor: string;
  /** Background color when item is selected. */
  itemSelectedBackgroundColor: string;
  /** Background color when item is pressed. */
  itemPressedBackgroundColor: string;
}

/** Theme values for the modal (colors). Pass resolved values (e.g. theme.background.val). */
export interface SelectModalTheme {
  /** Modal and list background. */
  backgroundColor?: string;
  /** Primary text (title, list items). */
  color?: string;
  /** Borders (header, search area, list items). */
  borderColor?: string;
  /** Secondary text (hints, clear button). */
  secondaryColor?: string;
  /** Accent (e.g. close button link color). */
  accentColor?: string;
  /** Pressed list item background. */
  itemPressedBackgroundColor?: string;
  /** Selected list item background (when value matches). */
  itemSelectedBackgroundColor?: string;
}

/** Shared props for single and multiple mode */
export interface SelectPropsBase<T> {
  /** List of options (primitives or objects) */
  options: T[];
  /** Placeholder when nothing is selected */
  placeholder?: string;
  /** Custom input component for the trigger. */
  customInput?: ComponentType<SelectInputProps>;
  /** Custom search input component inside the modal (only used when searchable is true). */
  customSearchInput?: ComponentType<SelectSearchInputProps>;
  /** Key to get display text from each item (e.g. "name"). Defaults to "label" if present. */
  labelKey?: keyof T & string;
  /** Key to get identity for comparison (e.g. "id"). Defaults to "value" if present. Can be same as labelKey. */
  valueKey?: keyof T & string;
  /** Custom function to get display label from item. Overrides labelKey. */
  getLabel?: (item: T) => string;
  /** Custom function to get comparable value from item. Overrides valueKey. */
  getValue?: (item: T) => unknown;
  /** Render each option in the modal list. Receives { item, isSelected, getLabel, getValue, accentColor, ... }. If not provided, shows label + default checkmark. */
  renderItem?: (props: SelectRenderItemProps<T>) => ReactNode;
  /** Key extractor for list items. */
  keyExtractor?: (item: T) => string;
  /** Async search callback (only used when searchable is true). */
  onSearch?: (query: string) => void | Promise<T[] | void>;
  /** Initial options when using onSearch. */
  initialOptions?: T[];
  /** Title shown in the modal header */
  modalTitle?: string;
  /** Placeholder for the search input inside the modal (when searchable is true). */
  searchPlaceholder?: string;
  /** Text for the close button */
  closeButtonText?: string;
  /** Text for the clear button (when clearable is true). */
  clearButtonText?: string;
  /** Allow clearing the selection. */
  clearable?: boolean;
  /** When true, the trigger is disabled. */
  disabled?: boolean;
  /**
   * When true, show search input in the modal and filter options by query. Default true.
   * When false, modal shows the full list without search.
   */
  searchable?: boolean;
  /**
   * When **multiple**, custom render for the trigger (e.g. chips). Receives { items, getLabel, getValue }.
   * If not provided, selected values are shown as comma-separated text.
   */
  renderTriggerContent?: (props: SelectTriggerContentProps<T>) => ReactNode;
  /**
   * When true, modal content is unmounted when the modal is closed. Next open mounts fresh.
   * Default false (content stays mounted).
   */
  unmountWhenClosed?: boolean;
  /** Optional theme for the modal. */
  modalTheme?: SelectModalTheme;
  /**
   * Custom list renderer (e.g. FlashList). When provided, the built-in FlatList is not used.
   * Receives { data, renderItem, keyExtractor, contentContainerStyle } so you can render the list as you like.
   */
  renderList?: (props: SelectListProps<T>) => ReactNode;
}

/** Single selection: one value or null. Use when multiple is false or omitted. */
export interface SelectPropsSingle<T> extends SelectPropsBase<T> {
  multiple?: false;
  value: T | null;
  onChange: (item: T | null) => void;
  formatMultipleLabel?: (items: T[]) => string;
}

/** Multiple selection: array of values. Use when multiple is true. */
export interface SelectPropsMultiple<T> extends SelectPropsBase<T> {
  multiple: true;
  value: T[];
  onChange: (items: T[]) => void;
  /** Format the trigger text when multiple items are selected. Default: "N selected" */
  formatMultipleLabel?: (items: T[]) => string;
}

/**
 * Props for Select.
 * - Single (multiple false/omit): value is T | null, onChange receives T | null.
 * - Multiple (multiple true): value is T[], onChange receives T[].
 */
export type SelectProps<T> = SelectPropsSingle<T> | SelectPropsMultiple<T>;
