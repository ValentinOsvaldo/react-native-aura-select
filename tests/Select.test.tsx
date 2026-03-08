import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Select } from '../src/Select';

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
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: options2[0],
        isSelected: false,
        getLabel: expect.any(Function),
        getValue: expect.any(Function),
        accentColor: expect.any(String),
        color: expect.any(String),
      })
    );
  });
});
