import React, { type ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DefaultSearchInput, DefaultSelectInput } from '../components';
import type { SelectProps, SelectPropsMultiple, SelectPropsSingle } from '../types';
import { buildGetLabel, buildGetValue, valuesEqual } from './utils';

/**
 * Select component that opens a modal with a list of options.
 * Optional search (searchable prop). Supports single/multiple, custom trigger/search inputs, clearable.
 *
 * @example
 * <Select options={options} value={selected} onChange={setSelected} />
 * @example
 * <Select options={options} value={selected} onChange={setSelected} searchable={false} />
 */
export function Select<T>(props: SelectPropsMultiple<T>): ReactElement;
export function Select<T>(props: SelectPropsSingle<T>): ReactElement;
export function Select<T>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  customInput: CustomInput,
  customSearchInput: CustomSearchInput,
  labelKey,
  valueKey,
  getLabel: getLabelProp,
  getValue: getValueProp,
  renderItem: renderItemProp,
  keyExtractor: keyExtractorProp,
  onSearch,
  initialOptions,
  modalTitle,
  searchPlaceholder = 'Search...',
  closeButtonText = 'Close',
  clearButtonText = 'Clear',
  clearable = false,
  disabled = false,
  modalTheme,
  multiple = false,
  formatMultipleLabel,
  renderTriggerContent,
  renderList,
  unmountWhenClosed = false,
  searchable = false,
  searchInputAutoFocus = false,
}: SelectProps<T>): ReactElement {
  const selectedItems: T[] = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    if (value != null && !Array.isArray(value)) {
      return [value as T];
    }
    return [];
  }, [multiple, value]);
  const themeStyles = useMemo(
    (): Record<string, object> | null =>
      modalTheme
        ? {
            modalContainer: {
              backgroundColor: modalTheme.backgroundColor ?? '#fff',
            },
            modalHeader: {
              borderBottomColor: modalTheme.borderColor ?? '#eee',
            },
            modalTitle: {
              color: modalTheme.color ?? '#000',
            },
            closeButtonText: {
              color: modalTheme.accentColor ?? '#007AFF',
            },
            itemSelected: {
              backgroundColor:
                modalTheme.itemSelectedBackgroundColor ?? '#e8f4fd',
            },
            checkmark: {
              color: modalTheme.accentColor ?? '#007AFF',
            },
            searchContainer: {
              borderBottomColor: modalTheme.borderColor ?? '#eee',
            },
            clearButtonText: {
              color: modalTheme.secondaryColor ?? '#666',
            },
            item: {
              borderBottomColor: modalTheme.borderColor ?? '#f0f0f0',
            },
            itemPressed: {
              backgroundColor:
                modalTheme.itemPressedBackgroundColor ?? '#f0f0f0',
            },
            itemLabel: {
              color: modalTheme.color ?? '#000',
            },
            hint: {
              color: modalTheme.secondaryColor ?? '#888',
            },
          }
        : null,
    [modalTheme],
  );
  const themeColors = useMemo(
    () => ({
      accentColor: modalTheme?.accentColor ?? '#007AFF',
      color: modalTheme?.color ?? '#000',
      borderColor: modalTheme?.borderColor ?? '#f0f0f0',
      secondaryColor: modalTheme?.secondaryColor ?? '#888',
      itemSelectedBackgroundColor:
        modalTheme?.itemSelectedBackgroundColor ?? '#e8f4fd',
      itemPressedBackgroundColor:
        modalTheme?.itemPressedBackgroundColor ?? '#f0f0f0',
    }),
    [modalTheme],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [asyncResults, setAsyncResults] = useState<T[] | null>(null);
  const [searching, setSearching] = useState(false);

  const getLabel = useMemo(
    () => buildGetLabel<T>({ getLabel: getLabelProp, labelKey }),
    [getLabelProp, labelKey],
  );
  const getValue = useMemo(
    () => buildGetValue<T>({ getValue: getValueProp, valueKey }),
    [getValueProp, valueKey],
  );

  const keyExtractor = useCallback(
    (item: T, index: number): string => {
      if (keyExtractorProp) return keyExtractorProp(item);
      const v = getValue(item);
      if (v !== null && v !== undefined && typeof v === 'object') {
        return `item-${index}`;
      }
      return String(v);
    },
    [keyExtractorProp, getValue],
  );

  const baseList = onSearch ? (initialOptions ?? options) : options;
  const filteredOrResultOptions = useMemo(() => {
    if (!searchable) return baseList;
    if (onSearch && asyncResults !== null) return asyncResults;
    if (!searchQuery.trim()) return baseList;
    const q = searchQuery.trim().toLowerCase();
    return baseList.filter((item) => getLabel(item).toLowerCase().includes(q));
  }, [searchable, onSearch, asyncResults, searchQuery, baseList, getLabel]);

  const openModal = useCallback(() => {
    setSearchQuery('');
    setAsyncResults(null);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSearchQuery('');
    setAsyncResults(null);
  }, []);

  const displayLabel =
    selectedItems.length === 0
      ? ''
      : multiple
        ? (formatMultipleLabel?.(selectedItems) ??
          selectedItems.map(getLabel).join(', '))
        : getLabel(selectedItems[0]!);

  const triggerContent =
    multiple && selectedItems.length > 0 && renderTriggerContent
      ? renderTriggerContent({ items: selectedItems, getLabel, getValue })
      : undefined;

  const TriggerInput = CustomInput ?? DefaultSelectInput;
  const SearchInput = CustomSearchInput ?? DefaultSearchInput;

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (!onSearch) return;
      if (!text.trim()) {
        setAsyncResults(null);
        return;
      }
      setSearching(true);
      const result = onSearch(text);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        (result as Promise<T[] | void>)
          .then((res) => {
            setAsyncResults(Array.isArray(res) ? res : null);
          })
          .finally(() => setSearching(false));
      } else {
        setAsyncResults(Array.isArray(result) ? result : null);
        setSearching(false);
      }
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    if (multiple) {
      (onChange as (items: T[]) => void)([]);
    } else {
      (onChange as (item: T | null) => void)(null);
    }
    closeModal();
  }, [onChange, closeModal, multiple]);

  const listHeader = useMemo(() => {
    if (!searchable && !clearable) return null;
    return (
      <View style={[styles.searchContainer, themeStyles?.searchContainer]}>
        {searchable && (
          <SearchInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder={searchPlaceholder}
            autoFocus={searchInputAutoFocus}
          />
        )}
        {clearable && (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text
              style={[styles.clearButtonText, themeStyles?.clearButtonText]}
            >
              {clearButtonText}
            </Text>
          </Pressable>
        )}
      </View>
    );
  }, [
    searchable,
    clearable,
    searchQuery,
    handleSearchChange,
    searchPlaceholder,
    clearButtonText,
    handleClear,
    SearchInput,
    themeStyles?.searchContainer,
    themeStyles?.clearButtonText,
  ]);

  const handleSelect = useCallback(
    (item: T) => {
      if (multiple) {
        const itemVal = getValue(item);
        const isSelected = selectedItems.some((s) =>
          valuesEqual(getValue(s), itemVal),
        );
        const next = isSelected
          ? selectedItems.filter((s) => !valuesEqual(getValue(s), itemVal))
          : [...selectedItems, item];
        (onChange as (items: T[]) => void)(next);
      } else {
        (onChange as (item: T | null) => void)(item);
        closeModal();
      }
    },
    [onChange, closeModal, multiple, selectedItems, getValue],
  );

  const isItemSelected = useCallback(
    (item: T) => {
      const itemVal = getValue(item);
      return selectedItems.some((s) => valuesEqual(getValue(s), itemVal));
    },
    [selectedItems, getValue],
  );

  const renderRow = useCallback(
    ({ item }: { item: T }) => {
      const selected = isItemSelected(item);
      const renderItemProps = {
        item,
        isSelected: selected,
        getLabel,
        getValue,
        accentColor: themeColors.accentColor,
        color: themeColors.color,
        borderColor: themeColors.borderColor,
        secondaryColor: themeColors.secondaryColor,
        itemSelectedBackgroundColor: themeColors.itemSelectedBackgroundColor,
        itemPressedBackgroundColor: themeColors.itemPressedBackgroundColor,
      };

      const content = renderItemProp ? (
        React.createElement(renderItemProp, renderItemProps)
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flex: 1,
          }}
        >
          <Text
            style={[styles.itemLabel, themeStyles?.itemLabel]}
            numberOfLines={1}
          >
            {getLabel(item)}
          </Text>
          {selected ? (
            <Text
              style={[styles.checkmark, { color: themeColors.accentColor }]}
            >
              ✓
            </Text>
          ) : null}
        </View>
      );

      return (
        <Pressable
          style={({ pressed }) => [
            styles.item,
            themeStyles?.item,
            selected && styles.itemSelected,
            selected && themeStyles?.itemSelected,
            pressed && styles.itemPressed,
            pressed && themeStyles?.itemPressed,
          ]}
          onPress={() => handleSelect(item)}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemContentInner}>{content}</View>
          </View>
        </Pressable>
      );
    },
    [
      renderItemProp,
      getLabel,
      getValue,
      handleSelect,
      themeStyles,
      themeColors,
      isItemSelected,
    ],
  );

  return (
    <>
      <TriggerInput
        value={displayLabel}
        onPress={disabled ? () => {} : openModal}
        placeholder={placeholder}
        disabled={disabled}
        content={triggerContent}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        {!unmountWhenClosed || modalVisible ? (
          <View
            style={[styles.modalContainer, themeStyles?.modalContainer]}
          >
            <View style={[styles.modalHeader, themeStyles?.modalHeader]}>
              {modalTitle ? (
                <Text style={[styles.modalTitle, themeStyles?.modalTitle]}>
                  {modalTitle}
                </Text>
              ) : null}
              <Pressable
                style={styles.closeButton}
                onPress={closeModal}
                hitSlop={12}
              >
                <Text
                  style={[styles.closeButtonText, themeStyles?.closeButtonText]}
                >
                  {closeButtonText}
                </Text>
              </Pressable>
            </View>

            {listHeader}

            {searchable && searching ? (
              <View style={styles.centered}>
                <ActivityIndicator
                  size="small"
                  color={modalTheme?.secondaryColor ?? '#888'}
                  style={styles.loadingSpinner}
                />
                <Text
                  style={[styles.hint, themeStyles?.hint, styles.loadingText]}
                >
                  Searching...
                </Text>
              </View>
            ) : filteredOrResultOptions.length === 0 ? (
              <View style={styles.centered}>
                <Text style={[styles.hint, themeStyles?.hint]}>No results</Text>
              </View>
            ) : renderList ? (
              renderList({
                data: filteredOrResultOptions,
                renderItem: (info) => renderRow({ item: info.item }),
                keyExtractor,
                contentContainerStyle: styles.listContent,
              })
            ) : (
              <FlatList
                data={filteredOrResultOptions}
                renderItem={renderRow}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 24,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    minHeight: 48,
    justifyContent: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flex: 1,
  },
  itemContentInner: {
    flex: 1,
    minWidth: 0,
  },
  itemSelected: {
    backgroundColor: '#e8f4fd',
  },
  itemPressed: {
    backgroundColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize: 16,
    color: '#000',
  },
  checkmark: {
    fontSize: 22,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingSpinner: {
    marginBottom: 12,
  },
  loadingText: {
    marginTop: 0,
  },
  hint: {
    fontSize: 15,
    color: '#888',
  },
});
