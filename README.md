# react-native-aura-select

A React Native select component that opens a modal with a list of options. Supports optional search, single/multiple selection, custom trigger and search inputs, and clearable selection.

## Installation

```bash
npm install react-native-aura-select
# or
yarn add react-native-aura-select
# or
pnpm add react-native-aura-select
```

### Peer Dependencies

This package requires `react` and `react-native` as peer dependencies (they should already be in your project).

## Quick Start

```tsx
import { useState } from 'react';
import { Select } from 'react-native-aura-select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

function MyScreen() {
  const [selected, setSelected] = useState<typeof options[0] | null>(null);

  return (
    <Select
      options={options}
      value={selected}
      onChange={setSelected}
      placeholder="Select a fruit..."
    />
  );
}
```

## Features

- **Optional search** – Enable with `searchable={true}` to filter options by label
- **Async search** – Use `onSearch(query)` for API-backed options
- **Custom inputs** – Plug in your own trigger and search field components
- **Flexible item shape** – Works with primitives or objects via `labelKey`/`valueKey` or `getLabel`/`getValue`
- **Clearable** – Optional "Clear" action in the modal
- **Multiple selection** – Select several options with `multiple={true}`

## API Reference

### Components

| Export | Description |
|--------|--------------|
| `Select` | Main select component |
| `DefaultSelectInput` | Default trigger input (style-agnostic) |
| `DefaultSearchInput` | Default search input for the modal |

### Types

| Type | Description |
|------|-------------|
| `SelectProps<T>` | Props for the Select component |
| `SelectPropsSingle<T>` | Props when `multiple` is false |
| `SelectPropsMultiple<T>` | Props when `multiple` is true |
| `SelectInputProps` | Props for custom trigger components |
| `SelectSearchInputProps` | Props for custom search components |
| `SelectTriggerContentProps<T>` | Props for `renderTriggerContent` |
| `SelectRenderItemProps<T>` | Props for `renderItem` (item, isSelected, getLabel, getValue, accentColor, colors, etc.) |
| `SelectListProps<T>` | Props for `renderList` (data, renderItem, keyExtractor, contentContainerStyle) |
| `SelectModalTheme` | Theme object for modal styling |

### Props

When `multiple` is `false` or omitted: `value` is `T | null`, `onChange` is `(item: T | null) => void`.  
When `multiple` is `true`: `value` is `T[]`, `onChange` is `(items: T[]) => void`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `T[]` | required | List of options (objects or primitives) |
| `value` | `T \| null` or `T[]` | required | Selected item(s) |
| `onChange` | function | required | Callback when selection changes |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `placeholder` | `string` | `'Select...'` | Shown when nothing is selected |
| `searchable` | `boolean` | `false` | Show search input in the modal |
| `clearable` | `boolean` | `false` | Show clear button in the modal |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `customInput` | `ComponentType<SelectInputProps>` | `DefaultSelectInput` | Custom trigger component |
| `customSearchInput` | `ComponentType<SelectSearchInputProps>` | `DefaultSearchInput` | Custom search component |
| `labelKey` | `keyof T & string` | `'label'` if present | Key for display text |
| `valueKey` | `keyof T & string` | `'value'` if present | Key for comparison |
| `getLabel` | `(item: T) => string` | from `labelKey` | Custom label getter |
| `getValue` | `(item: T) => unknown` | from `valueKey` | Custom value getter |
| `renderItem` | `(props: SelectRenderItemProps<T>) => ReactNode` | label + checkmark | Custom row renderer; receives `{ item, isSelected, getLabel, getValue, accentColor, color, ... }` |
| `renderTriggerContent` | `(props) => ReactNode` | — | Custom trigger content when multiple |
| `formatMultipleLabel` | `(items: T[]) => string` | — | Format trigger text when multiple |
| `onSearch` | `(query: string) => void \| Promise<T[] \| void>` | — | Async search callback |
| `initialOptions` | `T[]` | — | Initial options when using `onSearch` |
| `modalTitle` | `string` | — | Modal header title |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `closeButtonText` | `string` | `'Close'` | Close button label |
| `clearButtonText` | `string` | `'Clear'` | Clear button label |
| `unmountWhenClosed` | `boolean` | `false` | Unmount modal content when closed |
| `modalTheme` | `SelectModalTheme` | — | Theme for modal colors |
| `renderList` | `(props: SelectListProps<T>) => ReactNode` | — | Custom list (e.g. FlashList); receives `{ data, renderItem, keyExtractor, contentContainerStyle }` |

## Examples

### Without search (list only)

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  searchable={false}
/>
```

### Custom label/value keys

```tsx
<Select
  options={items}
  value={selected}
  onChange={setSelected}
  labelKey="name"
  valueKey="id"
/>
```

Or with custom getters:

```tsx
<Select
  options={items}
  value={selected}
  onChange={setSelected}
  getLabel={(item) => item.name}
  getValue={(item) => item.id}
/>
```

### Async search

```tsx
<Select
  options={[]}
  initialOptions={initialList}
  value={selected}
  onChange={setSelected}
  onSearch={async (query) => {
    const res = await api.search(query);
    return res.data;
  }}
  searchPlaceholder="Search users..."
/>
```

### Multiple selection

```tsx
const [selected, setSelected] = useState<Option[]>([]);

<Select
  options={options}
  value={selected}
  onChange={setSelected}
  multiple
  placeholder="Select..."
  formatMultipleLabel={(items) => `${items.length} item(s) selected`}
/>
```

### Clearable

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  clearable
  clearButtonText="Clear selection"
/>
```

### Custom option row (renderItem)

`renderItem` receives an object with `item`, `isSelected`, `getLabel`, `getValue`, and theme colors (`accentColor`, `color`, `borderColor`, etc.) so you can render a checkbox, custom icon, or fully styled row. You can pass either a render function `(props) => <YourRow {...props} />` or the component directly: `renderItem={YourRow}` (both are supported and avoid infinite re-renders).

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  renderItem={({ item, isSelected, getLabel, accentColor, color }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: isSelected ? accentColor : '#ccc',
          backgroundColor: isSelected ? accentColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
      </View>
      <Text style={{ fontSize: 16, color }} numberOfLines={1}>
        {getLabel(item)}
      </Text>
    </View>
  )}
/>
```

### Custom trigger content (e.g. chips)

```tsx
<Select
  multiple
  value={users}
  onChange={setUsers}
  labelKey="name"
  valueKey="id"
  renderTriggerContent={({ items, getLabel, getValue }) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {items.map((item) => (
        <Chip key={String(getValue(item))} label={getLabel(item)} />
      ))}
    </View>
  )}
/>
```

### Custom trigger and search inputs

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  customInput={(props) => (
    <Pressable onPress={props.onPress}>
      <View style={inputStyle}>
        <Text>{props.value || props.placeholder}</Text>
      </View>
    </Pressable>
  )}
  customSearchInput={(props) => (
    <Input
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
    />
  )}
/>
```

### Custom list (e.g. FlashList)

Use `renderList` to replace the default FlatList with [FlashList](https://shopify.github.io/flash-list/) or any other list component. You receive `{ data, renderItem, keyExtractor, contentContainerStyle }` and render the list as you like:

```tsx
import { FlashList } from '@shopify/flash-list';
import { Select } from 'react-native-aura-select';

<Select
  options={options}
  value={selected}
  onChange={setSelected}
  renderList={({ data, renderItem, keyExtractor, contentContainerStyle }) => (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      estimatedItemSize={48}
    />
  )}
/>
```

### Modal theme

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  modalTheme={{
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderColor: '#333',
    secondaryColor: '#999',
    accentColor: '#0a84ff',
    itemSelectedBackgroundColor: '#2a2a2a',
    itemPressedBackgroundColor: '#333',
  }}
/>
```

## Testing

Tests follow the [React Native testing guide](https://reactnative.dev/docs/testing-overview#component-tests): [Jest](https://jestjs.io/) for the test runner and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) for component tests (render, `fireEvent`, queries).

```bash
npm test              # run tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

Tests live in the `tests/` folder: unit tests for helpers (`utils.test.ts`) and component tests for `Select`, `DefaultSelectInput`, and `DefaultSearchInput`.

> **Note:** [React's Test Renderer is deprecated](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#deprecated-react-test-renderer) as of React 19. React Native Testing Library still uses it internally until [v14+](https://github.com/callstack/react-native-testing-library/issues/1835) migrates to an alternative. This package does not list `react-test-renderer` as a direct dependency.

## Roadmap

- [ ] **Website / documentation** — Create a website and more complete documentation in the future.

## License

MIT
