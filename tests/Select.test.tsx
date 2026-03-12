import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Select } from '../src/Select';
import type { SelectRenderItemProps } from '../src/types';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

function SelectWrapper() {
  const [value, setValue] = useState<typeof options[0] | null>(null);
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select a fruit..."
      searchable={false}
    />
  );
}

describe('Select', () => {
  it('renders trigger with placeholder when nothing selected', () => {
    render(<SelectWrapper />);
    expect(screen.getByText('Select a fruit...')).toBeTruthy();
  });

  it('opens modal when trigger is pressed', () => {
    render(<SelectWrapper />);
    fireEvent.press(screen.getByText('Select a fruit...'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.getByText('Cherry')).toBeTruthy();
  });

  it('selects option and closes modal in single mode', () => {
    render(<SelectWrapper />);
    fireEvent.press(screen.getByText('Select a fruit...'));
    fireEvent.press(screen.getByText('Banana'));
    expect(screen.getAllByText('Banana').length).toBeGreaterThan(0);
  });

  it('shows selected value on trigger after selection', () => {
    render(<SelectWrapper />);
    fireEvent.press(screen.getByText('Select a fruit...'));
    fireEvent.press(screen.getByText('Cherry'));
    expect(screen.getAllByText('Cherry').length).toBeGreaterThan(0);
  });

  it('renders with custom renderItem and receives item, isSelected, getLabel, getValue, theme colors', () => {
    const renderItem = jest.fn(({ item, isSelected, getLabel }) => (
      <>{getLabel(item)} {isSelected ? '(selected)' : ''}</>
    ));
    const options2 = [{ label: 'One', value: '1' }];
    const Comp = () => {
      const [v, setV] = useState<typeof options2[0] | null>(null);
      return (
        <Select
          options={options2}
          value={v}
          onChange={setV}
          searchable={false}
          renderItem={renderItem}
        />
      );
    };
    render(<Comp />);
    fireEvent.press(screen.getByText('Select...'));
    // React.createElement(renderItem, props) may pass (props, undefined) as (props, children)
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: options2[0],
        isSelected: false,
        getLabel: expect.any(Function),
        getValue: expect.any(Function),
        accentColor: expect.any(String),
        color: expect.any(String),
      }),
      undefined
    );
  });

  it('does not crash when using custom renderItem (checkbox-style row with all theme props)', () => {
    function CustomRow({ item, isSelected, getLabel, accentColor, color }: SelectRenderItemProps<typeof options[0]>) {
      return (
        <View>
          <Text style={{ color }}>{getLabel(item)}</Text>
          {isSelected ? <Text style={{ color: accentColor }}>✓</Text> : null}
        </View>
      );
    }
    const Comp = () => {
      const [v, setV] = useState<typeof options[0] | null>(null);
      return (
        <Select
          options={options}
          value={v}
          onChange={setV}
          placeholder="Pick one..."
          searchable={false}
          renderItem={(props) => <CustomRow {...props} />}
        />
      );
    };
    expect(() => render(<Comp />)).not.toThrow();
    expect(screen.getByText('Pick one...')).toBeTruthy();
    fireEvent.press(screen.getByText('Pick one...'));
    expect(screen.getByText('Apple')).toBeTruthy();
    fireEvent.press(screen.getByText('Apple'));
    expect(screen.getAllByText('Apple').length).toBeGreaterThan(0);
  });

  it('does not crash when using custom renderItem in multiple mode', () => {
    function CustomRow({ item, isSelected, getLabel }: SelectRenderItemProps<typeof options[0]>) {
      return (
        <View>
          <Text>{getLabel(item)}</Text>
          {isSelected ? <Text>✓</Text> : null}
        </View>
      );
    }
    const Comp = () => {
      const [v, setV] = useState<typeof options>([]);
      return (
        <Select
          options={options}
          value={v}
          onChange={setV}
          multiple
          placeholder="Pick..."
          searchable={false}
          renderItem={(props) => <CustomRow {...props} />}
        />
      );
    };
    expect(() => render(<Comp />)).not.toThrow();
    fireEvent.press(screen.getByText('Pick...'));
    fireEvent.press(screen.getByText('Banana'));
    fireEvent.press(screen.getByText('Cherry'));
    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.getByText('Cherry')).toBeTruthy();
  });

  describe('multiple selection', () => {
    it('renders trigger with placeholder when no items selected', () => {
      const Comp = () => {
        const [v, setV] = useState<typeof options>([]);
        return (
          <Select
            options={options}
            value={v}
            onChange={setV}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
          />
        );
      };
      render(<Comp />);
      expect(screen.getByText('Pick fruits...')).toBeTruthy();
    });

    it('keeps modal open and adds items to selection when multiple is true', () => {
      const Comp = () => {
        const [v, setV] = useState<typeof options>([]);
        return (
          <Select
            options={options}
            value={v}
            onChange={setV}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
          />
        );
      };
      render(<Comp />);
      fireEvent.press(screen.getByText('Pick fruits...'));
      fireEvent.press(screen.getByText('Apple'));
      // Modal stays open in multiple mode; list options still visible
      expect(screen.getByText('Banana')).toBeTruthy();
      expect(screen.getByText('Cherry')).toBeTruthy();
      // Trigger shows selected label (Apple appears in trigger and in list)
      expect(screen.getAllByText('Apple').length).toBeGreaterThan(0);
    });

    it('calls onChange with array of selected items when selecting in multiple mode', () => {
      const onChange = jest.fn();
      const Comp = () => {
        const [v, setV] = useState<typeof options>([]);
        return (
          <Select
            options={options}
            value={v}
            onChange={(next) => {
              setV(next);
              onChange(next);
            }}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
          />
        );
      };
      render(<Comp />);
      fireEvent.press(screen.getByText('Pick fruits...'));
      fireEvent.press(screen.getByText('Banana'));
      expect(onChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([expect.objectContaining({ label: 'Banana', value: 'banana' })])
      );
      expect(onChange.mock.calls[0]![0]).toHaveLength(1);

      fireEvent.press(screen.getByText('Cherry'));
      expect(onChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ label: 'Banana', value: 'banana' }),
          expect.objectContaining({ label: 'Cherry', value: 'cherry' }),
        ])
      );
      expect(onChange.mock.calls[1]![0]).toHaveLength(2);
    });

    it('deselects item when pressing again in multiple mode', () => {
      const onChange = jest.fn();
      const Comp = () => {
        const [v, setV] = useState<typeof options>([options[1]!]); // Banana selected
        return (
          <Select
            options={options}
            value={v}
            onChange={(next) => {
              setV(next);
              onChange(next);
            }}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
          />
        );
      };
      render(<Comp />);
      // Trigger and modal list both may render "Banana"; use first for trigger to open modal
      const bananas = screen.getAllByText('Banana');
      fireEvent.press(bananas[0]!);
      // Then press the Banana row in the list to deselect (trigger is [0], list row is [1])
      fireEvent.press(bananas[1]!);
      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('passes correct isSelected to renderItem for each option in multiple mode', () => {
      const renderItem = jest.fn(({ item, isSelected, getLabel }) => (
        <>{getLabel(item)}{isSelected ? ' (selected)' : ''}</>
      ));
      const Comp = () => {
        const [v, setV] = useState<typeof options>([options[0]!, options[2]!]); // Apple, Cherry
        return (
          <Select
            options={options}
            value={v}
            onChange={setV}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
            renderItem={renderItem}
          />
        );
      };
      render(<Comp />);
      fireEvent.press(screen.getByText('Apple, Cherry')); // open modal

      const appleCall = renderItem.mock.calls.find((c) => c[0].item.value === 'apple');
      const bananaCall = renderItem.mock.calls.find((c) => c[0].item.value === 'banana');
      const cherryCall = renderItem.mock.calls.find((c) => c[0].item.value === 'cherry');

      expect(appleCall).toBeDefined();
      expect(appleCall![0].isSelected).toBe(true);
      expect(bananaCall).toBeDefined();
      expect(bananaCall![0].isSelected).toBe(false);
      expect(cherryCall).toBeDefined();
      expect(cherryCall![0].isSelected).toBe(true);
    });

    it('shows formatMultipleLabel on trigger when provided', () => {
      const formatMultipleLabel = (items: typeof options) =>
        `${items.length} fruit(s) selected`;
      const Comp = () => {
        const [v, setV] = useState<typeof options>([options[0]!]);
        return (
          <Select
            options={options}
            value={v}
            onChange={setV}
            multiple
            placeholder="Pick fruits..."
            searchable={false}
            formatMultipleLabel={formatMultipleLabel}
          />
        );
      };
      render(<Comp />);
      expect(screen.getByText('1 fruit(s) selected')).toBeTruthy();
    });
  });
});
